import 'dotenv/config';
import { db } from '../db';
import { sql } from 'drizzle-orm';

async function main() {
    console.log("Generating Reports . . .");

    try {
        const r1 = await db.execute(sql`SELECT * FROM get_report_top_components()`);
        console.log('--- Top Performing Components ---');
        console.table(r1.rows);

        const r2 = await db.execute(sql`SELECT * FROM get_report_user_leaderboard()`);
        console.log('--- User Reputation Leaderboard ---');
        console.table(r2.rows);

        const r3 = await db.execute(sql`SELECT * FROM get_report_price_performance()`);
        console.log('--- Price-to-Performance Analysis ---');
        console.table(r3.rows);

        const r4 = await db.execute(sql`SELECT * FROM get_report_budget_tier()`);
        console.log('--- Budget Tier Popularity ---');
        console.table(r4.rows);

        const r5 = await db.execute(sql`SELECT * FROM get_report_compatibility()`);
        console.log('--- Component Compatibility ---');
        console.table(r5.rows);

        const r6 = await db.execute(sql`SELECT * FROM get_report_storage_optimization()`);
        console.log('--- Storage Optimization ---');
        console.table(r6.rows);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
