<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\WasteCollectionZone;
use App\Models\WasteReport;
use App\Models\User;
use App\Models\District;
use App\Models\City;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Dashboard administrateur principal
     */
    public function dashboard()
    {
        // Statistiques générales
        $stats = [
            'total_zones' => WasteCollectionZone::count(),
            'total_reports' => WasteReport::count(),
            'total_users' => User::where('role', 'citizen')->count(),
            'urgent_zones' => WasteCollectionZone::whereRaw('(current_fill_level / capacity_liters) * 100 > 90')->count(),
            'pending_reports' => WasteReport::where('status', 'pending')->count(),
            'verified_reports' => WasteReport::where('status', 'verified')->count(),
        ];

        // Évolution des signalements (7 derniers jours)
        $reportsEvolution = WasteReport::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', Carbon::now()->subDays(7))
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->map(function ($item) {
            return [
                'date' => Carbon::parse($item->date)->format('d/m'),
                'count' => $item->count
            ];
        });

        // Zones les plus critiques
        $criticalZones = WasteCollectionZone::with(['district.city'])
            ->whereRaw('(current_fill_level / capacity_liters) * 100 > 80')
            ->orderByRaw('(current_fill_level / capacity_liters) DESC')
            ->take(5)
            ->get()
            ->map(function ($zone) {
                return [
                    'id' => $zone->id,
                    'name' => $zone->name,
                    'district' => $zone->district->name ?? 'Non défini',
                    'city' => $zone->district->city->name ?? 'Non défini',
                    'fill_percentage' => round(($zone->current_fill_level / $zone->capacity_liters) * 100),
                    'priority' => $zone->priority_level,
                    'last_emptied' => $zone->last_emptied_at ? $zone->last_emptied_at->diffForHumans() : 'Jamais',
                ];
            });

        // Utilisateurs les plus actifs
        $topUsers = User::with('district')
            ->where('role', 'citizen')
            ->withCount('reports')
            ->orderBy('reports_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'district' => $user->district->name ?? 'Non défini',
                    'reports_count' => $user->reports_count,
                    'points' => $user->points,
                    'level' => $user->level,
                ];
            });

        // Signalements récents
        $recentReports = WasteReport::with(['user', 'wasteCollectionZone', 'district'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
                    'user_name' => $report->user->name,
                    'zone_name' => $report->wasteCollectionZone->name,
                    'district_name' => $report->district->name ?? 'Non défini',
                    'priority' => $report->priority,
                    'status' => $report->status,
                    'fill_level' => $report->fill_level,
                    'created_at' => $report->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'reportsEvolution' => $reportsEvolution,
            'criticalZones' => $criticalZones,
            'topUsers' => $topUsers,
            'recentReports' => $recentReports,
        ]);
    }

    /**
     * Gestion des zones de collecte
     */
    public function zones()
    {
        $zones = WasteCollectionZone::with(['district.city'])
            ->paginate(20)
            ->through(function ($zone) {
                return [
                    'id' => $zone->id,
                    'name' => $zone->name,
                    'district' => $zone->district->name ?? 'Non défini',
                    'city' => $zone->district->city->name ?? 'Non défini',
                    'capacity' => $zone->capacity_liters,
                    'current_fill' => $zone->current_fill_level,
                    'fill_percentage' => round(($zone->current_fill_level / $zone->capacity_liters) * 100),
                    'priority' => $zone->priority_level,
                    'zone_type' => $zone->zone_type,
                    'is_active' => $zone->is_active,
                    'last_emptied' => $zone->last_emptied_at ? $zone->last_emptied_at->format('d/m/Y H:i') : 'Jamais',
                    'coordinates' => $zone->coordinates,
                ];
            });

        $districts = District::with('city')->get()->map(function ($district) {
            return [
                'id' => $district->id,
                'name' => $district->name,
                'city' => $district->city->name ?? 'Non défini',
            ];
        });

        return Inertia::render('admin/zones', [
            'zones' => $zones,
            'districts' => $districts,
        ]);
    }

    /**
     * Gestion des signalements
     */
    public function reports()
    {
        $reports = WasteReport::with(['user', 'wasteCollectionZone', 'district'])
            ->latest()
            ->paginate(20)
            ->through(function ($report) {
                return [
                    'id' => $report->id,
                    'user' => [
                        'id' => $report->user->id,
                        'name' => $report->user->name,
                        'email' => $report->user->email,
                    ],
                    'zone' => [
                        'id' => $report->wasteCollectionZone->id,
                        'name' => $report->wasteCollectionZone->name,
                    ],
                    'district' => $report->district->name ?? 'Non défini',
                    'fill_level' => $report->fill_level,
                    'priority' => $report->priority,
                    'status' => $report->status,
                    'description' => $report->description,
                    'photos' => $report->photos,
                    'coordinates' => $report->coordinates,
                    'created_at' => $report->created_at->format('d/m/Y H:i'),
                    'verified_at' => $report->verified_at ? $report->verified_at->format('d/m/Y H:i') : null,
                    'resolved_at' => $report->resolved_at ? $report->resolved_at->format('d/m/Y H:i') : null,
                ];
            });

        return Inertia::render('admin/reports', [
            'reports' => $reports,
        ]);
    }

    /**
     * Gestion des utilisateurs
     */
    public function users()
    {
        $users = User::with('district')
            ->withCount('reports')
            ->paginate(20)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'points' => $user->points,
                    'level' => $user->level,
                    'district' => $user->district->name ?? 'Non défini',
                    'reports_count' => $user->reports_count,
                    'is_active' => $user->is_active,
                    'created_at' => $user->created_at->format('d/m/Y'),
                    'last_activity' => $user->last_activity_at ? $user->last_activity_at->diffForHumans() : 'Jamais',
                ];
            });

        return Inertia::render('admin/users', [
            'users' => $users,
        ]);
    }

    /**
     * Analytics et rapports
     */
    public function analytics()
    {
        // Données d'exemple pour les analytics
        $analytics = [
            'overview' => [
                'total_reports' => WasteReport::count(),
                'verified_reports' => WasteReport::where('status', 'verified')->count(),
                'resolved_reports' => WasteReport::where('status', 'resolved')->count(),
                'active_users' => User::where('is_active', true)->count(),
                'zones_critical' => WasteCollectionZone::whereRaw('(current_fill_level / capacity_liters) * 100 > 90')->count(),
                'efficiency_rate' => 85,
            ],
            'trends' => [
                'reports_trend' => 12,
                'users_trend' => 8,
                'efficiency_trend' => 5,
            ],
            'monthly_data' => [
                ['month' => 'Jan', 'reports' => 45, 'resolved' => 38, 'users' => 120],
                ['month' => 'Fév', 'reports' => 52, 'resolved' => 45, 'users' => 135],
                ['month' => 'Mar', 'reports' => 48, 'resolved' => 42, 'users' => 142],
                ['month' => 'Avr', 'reports' => 61, 'resolved' => 55, 'users' => 158],
                ['month' => 'Mai', 'reports' => 58, 'resolved' => 52, 'users' => 165],
                ['month' => 'Juin', 'reports' => 65, 'resolved' => 58, 'users' => 172],
            ],
            'districts_performance' => [
                ['name' => 'Centre-ville', 'reports' => 25, 'efficiency' => 92, 'zones' => 8],
                ['name' => 'Bastos', 'reports' => 18, 'efficiency' => 88, 'zones' => 6],
                ['name' => 'Mfoundi', 'reports' => 22, 'efficiency' => 85, 'zones' => 7],
                ['name' => 'Nlongkak', 'reports' => 15, 'efficiency' => 90, 'zones' => 5],
            ],
            'waste_types' => [
                ['type' => 'Déchets ménagers', 'percentage' => 45, 'count' => 120],
                ['type' => 'Déchets recyclables', 'percentage' => 25, 'count' => 67],
                ['type' => 'Déchets organiques', 'percentage' => 20, 'count' => 53],
                ['type' => 'Déchets dangereux', 'percentage' => 10, 'count' => 27],
            ],
        ];

        return Inertia::render('admin/analytics', [
            'analytics' => $analytics,
        ]);
    }

    /**
     * Planification des tournées
     */
    public function schedules()
    {
        // Données d'exemple pour les tournées
        $schedules = [
            [
                'id' => 1,
                'name' => 'Tournée Centre-ville Matin',
                'date' => now()->format('Y-m-d'),
                'time' => '08:00',
                'zones' => [
                    ['id' => 1, 'name' => 'Place de l\'Indépendance', 'district' => 'Centre-ville', 'priority' => 'high', 'estimated_time' => 30],
                    ['id' => 2, 'name' => 'Marché Central', 'district' => 'Centre-ville', 'priority' => 'high', 'estimated_time' => 45],
                ],
                'team' => [
                    'driver' => 'Jean Mballa',
                    'collectors' => ['Paul Nkomo', 'Marie Essono'],
                ],
                'vehicle' => [
                    'id' => 1,
                    'plate' => 'CM-001-YDE',
                    'capacity' => 5000,
                ],
                'status' => 'planned',
                'estimated_duration' => 120,
                'distance' => 15,
            ],
        ];

        $available_zones = WasteCollectionZone::with('district')
            ->get()
            ->map(function ($zone) {
                return [
                    'id' => $zone->id,
                    'name' => $zone->name,
                    'district' => $zone->district->name ?? 'Non défini',
                    'priority' => $zone->priority_level,
                    'fill_level' => round(($zone->current_fill_level / $zone->capacity_liters) * 100),
                ];
            });

        return Inertia::render('admin/schedules', [
            'schedules' => $schedules,
            'available_zones' => $available_zones,
            'teams' => [],
            'vehicles' => [],
        ]);
    }

    /**
     * Paramètres système
     */
    public function settings()
    {
        return Inertia::render('admin/settings', [
            'settings' => [
                'system' => [
                    'app_name' => 'EcoSmart City',
                    'app_version' => '1.0.0',
                    'timezone' => 'Africa/Douala',
                    'language' => 'fr',
                ],
                'notifications' => [
                    'email_enabled' => true,
                    'sms_enabled' => false,
                    'push_enabled' => true,
                ],
                'thresholds' => [
                    'critical_fill_level' => 90,
                    'warning_fill_level' => 70,
                    'max_response_time' => 24,
                ],
            ],
        ]);
    }

    /**
     * Créer une nouvelle zone de collecte
     */
    public function storeZone(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'district_id' => 'required|exists:districts,id',
            'coordinates' => 'required|string',
            'capacity_liters' => 'required|integer|min:100|max:10000',
            'zone_type' => 'required|in:residential,commercial,industrial,public',
            'priority_level' => 'required|in:low,medium,high',
            'is_active' => 'boolean',
            'description' => 'nullable|string|max:1000',
        ]);

        $coordinates = json_decode($validated['coordinates'], true);

        // Vérifier que le JSON est valide
        if (!$coordinates || !isset($coordinates['lat']) || !isset($coordinates['lng'])) {
            return redirect()->back()->withErrors(['coordinates' => 'Coordonnées invalides']);
        }

        $zone = WasteCollectionZone::create([
            'name' => $validated['name'],
            'district_id' => $validated['district_id'],
            'coordinates' => $coordinates,
            'capacity_liters' => $validated['capacity_liters'],
            'zone_type' => $validated['zone_type'],
            'priority_level' => $validated['priority_level'],
            'is_active' => $validated['is_active'] ?? true,
            'description' => $validated['description'],
            'current_fill_level' => 0,
            'last_emptied_at' => now(),
        ]);

        return redirect()->route('admin.zones')
            ->with('success', 'Zone de collecte créée avec succès.');
    }

    /**
     * Mettre à jour une zone de collecte
     */
    public function updateZone(Request $request, WasteCollectionZone $zone)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'district_id' => 'required|exists:districts,id',
            'coordinates' => 'required|string',
            'capacity_liters' => 'required|integer|min:100|max:10000',
            'zone_type' => 'required|in:residential,commercial,industrial,public',
            'priority_level' => 'required|in:low,medium,high',
            'is_active' => 'boolean',
            'description' => 'nullable|string|max:1000',
        ]);

        $coordinates = json_decode($validated['coordinates'], true);

        // Vérifier que le JSON est valide
        if (!$coordinates || !isset($coordinates['lat']) || !isset($coordinates['lng'])) {
            return redirect()->back()->withErrors(['coordinates' => 'Coordonnées invalides']);
        }

        $zone->update([
            'name' => $validated['name'],
            'district_id' => $validated['district_id'],
            'coordinates' => $coordinates,
            'capacity_liters' => $validated['capacity_liters'],
            'zone_type' => $validated['zone_type'],
            'priority_level' => $validated['priority_level'],
            'is_active' => $validated['is_active'] ?? true,
            'description' => $validated['description'],
        ]);

        return redirect()->route('admin.zones')
            ->with('success', 'Zone de collecte mise à jour avec succès.');
    }

    /**
     * Supprimer une zone de collecte
     */
    public function destroyZone(WasteCollectionZone $zone)
    {
        // Vérifier s'il y a des signalements associés
        $reportsCount = WasteReport::where('waste_collection_zone_id', $zone->id)->count();

        if ($reportsCount > 0) {
            return redirect()->route('admin.zones')
                ->with('error', "Impossible de supprimer cette zone. Elle contient {$reportsCount} signalement(s).");
        }

        $zone->delete();

        return redirect()->route('admin.zones')
            ->with('success', 'Zone de collecte supprimée avec succès.');
    }

    /**
     * Activer/Désactiver une zone de collecte
     */
    public function toggleZoneStatus(WasteCollectionZone $zone)
    {
        $zone->update([
            'is_active' => !$zone->is_active
        ]);

        $status = $zone->is_active ? 'activée' : 'désactivée';

        return redirect()->route('admin.zones')
            ->with('success', "Zone de collecte {$status} avec succès.");
    }

    /**
     * Valider un signalement (vérifier, rejeter ou résoudre)
     */
    public function validateReport(Request $request, WasteReport $report)
    {
        $validated = $request->validate([
            'action' => 'required|in:verify,reject,resolve',
            'admin_comment' => 'nullable|string|max:1000',
            'points_awarded' => 'nullable|integer|min:0|max:100',
            'new_status' => 'required|in:verified,rejected,resolved',
        ]);

        // Vérifier que l'action est cohérente avec le statut actuel
        if ($validated['action'] === 'verify' && $report->status !== 'pending') {
            return redirect()->route('admin.reports')
                ->with('error', 'Seuls les signalements en attente peuvent être vérifiés.');
        }

        if ($validated['action'] === 'resolve' && !in_array($report->status, ['pending', 'verified'])) {
            return redirect()->route('admin.reports')
                ->with('error', 'Seuls les signalements en attente ou vérifiés peuvent être résolus.');
        }

        // Validation spécifique pour le rejet
        if ($validated['action'] === 'reject' && empty($validated['admin_comment'])) {
            return redirect()->route('admin.reports')
                ->with('error', 'Un commentaire est obligatoire pour rejeter un signalement.');
        }

        // Mettre à jour le signalement
        $updateData = [
            'status' => $validated['new_status'],
            'admin_comment' => $validated['admin_comment'],
        ];

        // Ajouter les timestamps selon l'action
        switch ($validated['action']) {
            case 'verify':
                $updateData['verified_at'] = now();
                break;
            case 'resolve':
                $updateData['resolved_at'] = now();
                if (!$report->verified_at) {
                    $updateData['verified_at'] = now();
                }
                break;
        }

        $report->update($updateData);

        // Attribuer des points à l'utilisateur si vérification
        if ($validated['action'] === 'verify' && isset($validated['points_awarded'])) {
            $user = $report->user;
            $user->increment('points', $validated['points_awarded']);

            // Calculer le nouveau niveau (exemple: 100 points par niveau)
            $newLevel = floor($user->points / 100) + 1;
            if ($newLevel > $user->level) {
                $user->update(['level' => $newLevel]);
            }
        }

        // Enregistrer l'action dans l'historique (si la table existe)
        // Note: Cette fonctionnalité nécessite la création de la table report_actions
        /*
        $report->actions()->create([
            'user_id' => Auth::id(),
            'action_type' => $validated['action'],
            'description' => $validated['admin_comment'] ?: "Signalement {$validated['action']}",
            'performed_at' => now(),
        ]);
        */

        $message = match($validated['action']) {
            'verify' => 'Signalement vérifié avec succès.',
            'reject' => 'Signalement rejeté avec succès.',
            'resolve' => 'Signalement marqué comme résolu avec succès.',
        };

        return redirect()->route('admin.reports')
            ->with('success', $message);
    }

    /**
     * Créer un nouvel utilisateur
     */
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:admin,citizen',
            'district_id' => 'nullable|exists:districts,id',
            'password' => 'required|string|min:8|confirmed',
            'is_active' => 'boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'role' => $validated['role'],
            'district_id' => $validated['district_id'],
            'password' => Hash::make($validated['password']),
            'is_active' => $validated['is_active'] ?? true,
            'points' => 0,
            'level' => 1,
        ]);

        return redirect()->route('admin.users')
            ->with('success', 'Utilisateur créé avec succès.');
    }

    /**
     * Mettre à jour un utilisateur
     */
    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:admin,citizen',
            'district_id' => 'nullable|exists:districts,id',
            'password' => 'nullable|string|min:8|confirmed',
            'is_active' => 'boolean',
            'points' => 'nullable|integer|min:0',
            'level' => 'nullable|integer|min:1',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'role' => $validated['role'],
            'district_id' => $validated['district_id'],
            'is_active' => $validated['is_active'] ?? true,
        ];

        // Mettre à jour le mot de passe seulement s'il est fourni
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        // Mettre à jour les points et niveau pour les citoyens
        if ($validated['role'] === 'citizen') {
            if (isset($validated['points'])) {
                $updateData['points'] = $validated['points'];
            }
            if (isset($validated['level'])) {
                $updateData['level'] = $validated['level'];
            }
        }

        $user->update($updateData);

        return redirect()->route('admin.users')
            ->with('success', 'Utilisateur mis à jour avec succès.');
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroyUser(User $user)
    {
        // Empêcher la suppression de son propre compte
        if ($user->id === Auth::id()) {
            return redirect()->route('admin.users')
                ->with('error', 'Vous ne pouvez pas supprimer votre propre compte.');
        }

        // Vérifier s'il y a des signalements associés
        $reportsCount = WasteReport::where('user_id', $user->id)->count();

        if ($reportsCount > 0) {
            // Anonymiser les signalements au lieu de les supprimer
            WasteReport::where('user_id', $user->id)->update([
                'user_id' => null,
                'description' => 'Signalement d\'un utilisateur supprimé'
            ]);
        }

        $user->delete();

        return redirect()->route('admin.users')
            ->with('success', 'Utilisateur supprimé avec succès.');
    }

    /**
     * Activer/Désactiver un utilisateur
     */
    public function toggleUserStatus(User $user)
    {
        // Empêcher la désactivation de son propre compte
        if ($user->id === Auth::id()) {
            return redirect()->route('admin.users')
                ->with('error', 'Vous ne pouvez pas désactiver votre propre compte.');
        }

        $user->update([
            'is_active' => !$user->is_active
        ]);

        $status = $user->is_active ? 'activé' : 'désactivé';

        return redirect()->route('admin.users')
            ->with('success', "Utilisateur {$status} avec succès.");
    }
}
