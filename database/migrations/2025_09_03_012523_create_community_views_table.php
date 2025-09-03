<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("
            CREATE VIEW community_view AS
            SELECT 
                tank.use,
                tank.tank_capacity,
                homehub.name AS homehub_name,
                homehub.user_id,
                latest_log.water_distance,
                tank.mac_add,
                log_quality.tds,
                (1 - ((CAST(latest_log.water_distance AS FLOAT) / 1000) - tank.offset) / tank.height) * 100 AS water_level_percentage
            FROM tank_sensorsdb_practice_ui AS tank
            LEFT JOIN homehub_devices_practice AS homehub ON tank.paired_with = homehub.mac_add
            LEFT JOIN quality_sensors_practice AS quality ON quality.paired_with = homehub.mac_add
            LEFT JOIN (
                SELECT mac_add, water_distance,
                    ROW_NUMBER() OVER (PARTITION BY mac_add ORDER BY datetime DESC) AS rn
                FROM stored_waterdb_practice_ui
            ) AS latest_log ON latest_log.mac_add = tank.mac_add AND latest_log.rn = 1
            LEFT JOIN (
                SELECT mac_add, tds
                FROM quality_data_practice_ui AS qd
                WHERE datetime = (
                    SELECT MAX(datetime)
                    FROM quality_data_practice_ui
                    WHERE mac_add = qd.mac_add
                )
            ) AS log_quality ON log_quality.mac_add = quality.mac_add;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS community_view");
    }
};
