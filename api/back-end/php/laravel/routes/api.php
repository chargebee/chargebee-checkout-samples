<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('generate_checkout_new_url', 'ChargebeeController@generateCheckoutNewUrl');
Route::post('generate_checkout_existing_url', 'ChargebeeController@generateCheckoutExistingUrl');
Route::post('generate_update_payment_method_url', 'ChargebeeController@generateUpdatePaymentMethodUrl');
Route::post('generate_portal_session', 'ChargebeeController@generatePortalSession');