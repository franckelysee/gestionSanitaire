<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\WasteCollectionZone;
use App\Models\WasteReport;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CitizenController extends Controller
{
    /**
     * Afficher le dashboard citoyen
     */
    public function index()
    {
        $user = Auth::user();

        // Statistiques utilisateur
        $userStats = [
            'reports_count' => WasteReport::where('user_id', $user->id)->count(),
            'points' => $user->points,
            'level' => $user->level,
            'verified_reports' => WasteReport::where('user_id', $user->id)
                ->where('status', 'verified')->count(),
        ];

        // Zones récentes signalées
        $recentReports = WasteReport::with(['wasteCollectionZone', 'district'])
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        // Statistiques générales
        $generalStats = [
            'total_zones' => WasteCollectionZone::count(),
            'urgent_zones' => WasteCollectionZone::whereRaw('(current_fill_level / capacity_liters) * 100 > 90')->count(),
            'average_fill_level' => WasteCollectionZone::avg('current_fill_level'),
            'last_update' => now()->format('H:i'),
        ];

        return Inertia::render('citizen/dashboard', [
            'userStats' => $userStats,
            'recentReports' => $recentReports,
            'generalStats' => $generalStats,
        ]);
    }

    /**
     * Afficher la carte interactive
     */
    public function map()
    {
        // Récupérer toutes les zones avec leurs informations
        $zones = WasteCollectionZone::with('district')
            ->get()
            ->map(function ($zone) {
                return [
                    'id' => $zone->id,
                    'name' => $zone->name,
                    'coordinates' => $zone->coordinates,
                    'fillLevel' => $zone->current_fill_level,
                    'capacity' => $zone->capacity_liters,
                    'priority' => $zone->priority_level,
                    'zoneType' => $zone->zone_type,
                    'lastEmptied' => $zone->last_emptied_at ?
                        $zone->last_emptied_at->diffForHumans() : 'Jamais',
                    'district' => $zone->district->name ?? 'Non défini',
                ];
            });

        // Statistiques pour la carte
        $stats = [
            'totalZones' => $zones->count(),
            'urgentZones' => $zones->where('priority', 'high')->count(),
            'averageFillLevel' => round($zones->avg(function ($zone) {
                return ($zone['fillLevel'] / $zone['capacity']) * 100;
            })),
            'lastUpdate' => now()->format('H:i'),
        ];

        return Inertia::render('citizen/map', [
            'zones' => $zones,
            'stats' => $stats,
        ]);
    }

    /**
     * Afficher le formulaire de signalement
     */
    public function reportForm(Request $request)
    {
        $zoneId = $request->get('zone');
        $selectedZone = null;

        if ($zoneId) {
            $selectedZone = WasteCollectionZone::with('district')->find($zoneId);
        }

        // Zones disponibles pour le signalement
        $zones = WasteCollectionZone::with('district')
            ->where('is_active', true)
            ->get()
            ->map(function ($zone) {
                return [
                    'id' => $zone->id,
                    'name' => $zone->name,
                    'district' => $zone->district->name ?? 'Non défini',
                    'coordinates' => $zone->coordinates,
                ];
            });

        return Inertia::render('citizen/report', [
            'zones' => $zones,
            'selectedZone' => $selectedZone ? [
                'id' => $selectedZone->id,
                'name' => $selectedZone->name,
                'district' => $selectedZone->district->name ?? 'Non défini',
                'coordinates' => $selectedZone->coordinates,
            ] : null,
        ]);
    }

    /**
     * Enregistrer un signalement
     */
    public function storeReport(Request $request)
    {
        $validated = $request->validate([
            'waste_collection_zone_id' => 'required|exists:waste_collection_zones,id',
            'fill_level' => 'required|numeric|min:0|max:100',
            'priority' => 'required|in:low,medium,high',
            'description' => 'nullable|string|max:1000',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'image|max:2048',
            'coordinates' => 'required|array',
            'coordinates.lat' => 'required|numeric',
            'coordinates.lng' => 'required|numeric',
        ]);

        $zone = WasteCollectionZone::findOrFail($validated['waste_collection_zone_id']);

        // Traitement des photos
        $photoUrls = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('reports', 'public');
                $photoUrls[] = $path;
            }
        }

        // Créer le signalement
        $report = WasteReport::create([
            'user_id' => Auth::id(),
            'waste_collection_zone_id' => $validated['waste_collection_zone_id'],
            'district_id' => $zone->district_id,
            'fill_level' => $validated['fill_level'],
            'priority' => $validated['priority'],
            'description' => $validated['description'],
            'photos' => $photoUrls,
            'coordinates' => $validated['coordinates'],
            'status' => 'pending',
        ]);

        // Attribuer des points à l'utilisateur
        $user = Auth::user();
        $pointsEarned = 10; // Points de base
        if ($validated['priority'] === 'high') $pointsEarned += 5;

        \App\Models\User::where('id', $user->id)->increment('points', $pointsEarned);

        // Enregistrer l'action
        $report->actions()->create([
            'user_id' => Auth::id(),
            'action_type' => 'created',
            'description' => 'Signalement créé',
            'performed_at' => now(),
        ]);

        return redirect()->route('citizen.dashboard')
            ->with('success', "Signalement enregistré avec succès ! Vous avez gagné {$pointsEarned} points.");
    }

    /**
     * Afficher les récompenses et achievements
     */
    public function achievements()
    {
        $user = Auth::user();

        // Récupérer tous les achievements
        $achievements = \App\Models\Achievement::where('is_active', true)->get();

        // Récupérer les achievements de l'utilisateur
        $userAchievements = \App\Models\UserAchievement::with('achievement')
            ->where('user_id', $user->id)
            ->get()
            ->pluck('achievement');

        // Statistiques utilisateur pour calculer les progrès
        $userStats = [
            'points' => $user->points,
            'level' => $user->level,
            'reports_count' => WasteReport::where('user_id', $user->id)->count(),
            'verified_reports' => WasteReport::where('user_id', $user->id)
                ->where('status', 'verified')->count(),
            'consecutive_days' => 5, // À implémenter avec la logique réelle
            'zones_covered' => WasteReport::where('user_id', $user->id)
                ->distinct('waste_collection_zone_id')->count(),
        ];

        return Inertia::render('citizen/achievements', [
            'achievements' => $achievements,
            'userAchievements' => $userAchievements,
            'userStats' => $userStats,
        ]);
    }

    /**
     * Page de profil utilisateur
     */
    public function profile()
    {
        $user = Auth::user();

        $achievements = [
            [
                'id' => 1,
                'name' => 'Premier Signalement',
                'description' => 'Effectuer votre premier signalement',
                'icon' => 'star',
                'unlocked' => true,
                'progress' => 1,
                'max_progress' => 1,
            ],
            [
                'id' => 2,
                'name' => 'Éco-Citoyen',
                'description' => 'Effectuer 10 signalements',
                'icon' => 'leaf',
                'unlocked' => false,
                'progress' => 3,
                'max_progress' => 10,
            ],
        ];

        $stats = [
            'total_reports' => 15,
            'verified_reports' => 12,
            'points_earned' => 450,
            'current_level' => 3,
            'next_level_points' => 500,
            'rank_position' => 25,
            'total_users' => 1250,
        ];

        return Inertia::render('citizen/profile', [
            'user' => $user,
            'achievements' => $achievements,
            'stats' => $stats,
        ]);
    }

    /**
     * Historique des signalements
     */
    public function history()
    {
        $reports = [
            [
                'id' => 1,
                'zone_name' => 'Place de l\'Indépendance',
                'district' => 'Centre-ville',
                'fill_level' => 85,
                'priority' => 'high',
                'status' => 'verified',
                'description' => 'Poubelle débordante avec déchets au sol',
                'photos' => [],
                'created_at' => now()->subDays(2)->toISOString(),
                'verified_at' => now()->subDays(1)->toISOString(),
                'points_earned' => 25,
            ],
            [
                'id' => 2,
                'zone_name' => 'Marché Central',
                'district' => 'Centre-ville',
                'fill_level' => 70,
                'priority' => 'medium',
                'status' => 'pending',
                'description' => 'Zone nécessitant une collecte',
                'photos' => [],
                'created_at' => now()->subHours(6)->toISOString(),
                'points_earned' => 0,
            ],
        ];

        return Inertia::render('citizen/history', [
            'reports' => [
                'data' => $reports,
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 20,
                'total' => count($reports),
            ],
        ]);
    }

    /**
     * Page des notifications
     */
    public function notifications()
    {
        $notifications = [
            [
                'id' => 1,
                'type' => 'report_verified',
                'title' => 'Signalement vérifié',
                'message' => 'Votre signalement #1 a été vérifié par notre équipe. Vous avez gagné 25 points !',
                'data' => ['report_id' => 1, 'points' => 25],
                'read' => false,
                'created_at' => now()->subHours(2)->toISOString(),
            ],
            [
                'id' => 2,
                'type' => 'achievement_unlocked',
                'title' => 'Nouveau badge débloqué',
                'message' => 'Félicitations ! Vous avez débloqué le badge "Éco-Citoyen"',
                'data' => ['achievement_id' => 2, 'points' => 50],
                'read' => true,
                'created_at' => now()->subDays(1)->toISOString(),
            ],
        ];

        return Inertia::render('citizen/notifications', [
            'notifications' => [
                'data' => $notifications,
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 20,
                'total' => count($notifications),
                'unread_count' => collect($notifications)->where('read', false)->count(),
            ],
        ]);
    }

    /**
     * Page d'aide et support
     */
    public function help()
    {
        $faqs = [
            [
                'id' => 1,
                'question' => 'Comment faire un signalement ?',
                'answer' => 'Pour faire un signalement, cliquez sur le bouton "Signaler" dans la navigation, remplissez le formulaire avec les détails de la zone, ajoutez des photos si possible, et soumettez votre signalement.',
                'category' => 'signalement',
            ],
            [
                'id' => 2,
                'question' => 'Comment gagner des points ?',
                'answer' => 'Vous gagnez des points en effectuant des signalements qui sont vérifiés par notre équipe. Plus votre signalement est précis et utile, plus vous gagnez de points.',
                'category' => 'points',
            ],
            [
                'id' => 3,
                'question' => 'Que faire si j\'ai oublié mon mot de passe ?',
                'answer' => 'Cliquez sur "Mot de passe oublié" sur la page de connexion et suivez les instructions envoyées par email.',
                'category' => 'compte',
            ],
            [
                'id' => 4,
                'question' => 'L\'application ne fonctionne pas correctement',
                'answer' => 'Essayez de rafraîchir la page ou de vider le cache de votre navigateur. Si le problème persiste, contactez notre support.',
                'category' => 'technique',
            ],
        ];

        $contact_info = [
            'email' => 'support@ecosmart.cm',
            'phone' => '+237 6XX XX XX XX',
            'address' => 'Yaoundé, Cameroun',
            'hours' => 'Lundi - Vendredi: 8h00 - 17h00',
        ];

        return Inertia::render('citizen/help', [
            'faqs' => $faqs,
            'contact_info' => $contact_info,
        ]);
    }

    /**
     * Mettre à jour le profil utilisateur
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($validated);

        return redirect()->route('citizen.profile')
            ->with('success', 'Profil mis à jour avec succès.');
    }

    /**
     * Mettre à jour un signalement (seulement si en attente)
     */
    public function updateReport(Request $request, WasteReport $report)
    {
        // Vérifier que l'utilisateur est propriétaire du signalement
        if ($report->user_id !== Auth::id()) {
            abort(403, 'Non autorisé');
        }

        // Vérifier que le signalement est encore modifiable
        if ($report->status !== 'pending') {
            return redirect()->route('citizen.history')
                ->with('error', 'Ce signalement ne peut plus être modifié.');
        }

        $validated = $request->validate([
            'description' => 'required|string|max:1000',
            'fill_level' => 'required|integer|min:0|max:100',
            'priority' => 'required|in:low,medium,high',
            'photos.*' => 'nullable|image|max:5120', // 5MB max par image
        ]);

        $updateData = [
            'description' => $validated['description'],
            'fill_level' => $validated['fill_level'],
            'priority' => $validated['priority'],
        ];

        // Gérer les nouvelles photos si fournies
        if ($request->hasFile('photos')) {
            $photos = [];
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('reports', 'public');
                $photos[] = $path;
            }
            $updateData['photos'] = array_merge($report->photos ?? [], $photos);
        }

        $report->update($updateData);

        return redirect()->route('citizen.history')
            ->with('success', 'Signalement mis à jour avec succès.');
    }

    /**
     * Supprimer un signalement (seulement si en attente)
     */
    public function destroyReport(WasteReport $report)
    {
        // Vérifier que l'utilisateur est propriétaire du signalement
        if ($report->user_id !== Auth::id()) {
            abort(403, 'Non autorisé');
        }

        // Vérifier que le signalement est encore supprimable
        if ($report->status !== 'pending') {
            return redirect()->route('citizen.history')
                ->with('error', 'Ce signalement ne peut plus être supprimé.');
        }

        // Supprimer les photos associées
        if ($report->photos) {
            foreach ($report->photos as $photo) {
                Storage::disk('public')->delete($photo);
            }
        }

        $report->delete();

        return redirect()->route('citizen.history')
            ->with('success', 'Signalement supprimé avec succès.');
    }

    /**
     * Marquer des notifications comme lues
     */
    public function markNotificationsAsRead(Request $request)
    {
        $validated = $request->validate([
            'notification_ids' => 'required|array',
            'notification_ids.*' => 'integer',
        ]);

        // Logique pour marquer les notifications comme lues
        // (À implémenter avec le modèle Notification)

        return response()->json([
            'success' => true,
            'message' => 'Notifications marquées comme lues.'
        ]);
    }

    /**
     * Supprimer des notifications
     */
    public function deleteNotifications(Request $request)
    {
        $validated = $request->validate([
            'notification_ids' => 'required|array',
            'notification_ids.*' => 'integer',
        ]);

        // Logique pour supprimer les notifications
        // (À implémenter avec le modèle Notification)

        return response()->json([
            'success' => true,
            'message' => 'Notifications supprimées.'
        ]);
    }
}
