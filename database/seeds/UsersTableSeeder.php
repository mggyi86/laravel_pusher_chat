<?php

use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->truncate();

        factory(User::class)->create([
            'name' => 'user',
            'email' => 'user@user.com',
        ]);

        factory(User::class)->create([
            'name' => 'user1',
            'email' => 'user1@user1.com'
        ]);

        factory(User::class, 60)->create();
    }
}
