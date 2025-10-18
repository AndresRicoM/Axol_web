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
            select
                coalesce(tank.use, quality.use) as use,
                tank.tank_capacity,
                homehub.name as homehub_name,
                homehub.user_id,
                latest_log.water_distance,
                coalesce(tank.mac_add, quality.mac_add) as mac_add,
                log_quality.tds,
                (1 - ((cast(latest_log.water_distance as FLOAT) / 1000) - tank.offset) / tank.height) * 100 as water_level_percentage,
                (PI() * POWER(tank.diameter / 2, 2) * (tank.height - ((cast(latest_log.water_distance as FLOAT) / 1000) - tank.offset))) * 1000 as current_water
            from
                tank_sensorsdb_practice_ui as tank
            full outer join quality_sensors_practice as quality
                on
                tank.mac_add = quality.mac_add
            left join homehub_devices_practice as homehub
                on
                coalesce(tank.paired_with, quality.paired_with) = homehub.mac_add
            left join (
                select
                    mac_add,
                    water_distance,
                    row_number() over (partition by mac_add
                order by
                    datetime desc) as rn
                from
                    stored_waterdb_practice_ui
            ) as latest_log
                on
                latest_log.mac_add = tank.mac_add
                and latest_log.rn = 1
            left join (
                select
                    mac_add,
                    tds
                from
                    quality_data_practice_ui as qd
                where
                    datetime = (
                    select
                        MAX(datetime)
                    from
                        quality_data_practice_ui
                    where
                        mac_add = qd.mac_add
                )
            ) as log_quality
                on
                log_quality.mac_add = coalesce(tank.mac_add, quality.mac_add);
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
