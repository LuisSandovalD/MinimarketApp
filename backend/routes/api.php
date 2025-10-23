<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\{
    RegisteredUserController,
    AuthenticatedSessionController,
    PasswordResetLinkController,
    NewPasswordController,
    VerifyEmailController,
    EmailVerificationNotificationController
};
use App\Http\Controllers\Admin\{
    UserController,
    CustomerController,
    SupplierController,
    ShoppingController,
    ShoppingDetailController,
    ProductController,
    CategoryController,
    UnitController,
    SalesController,
    PaymentMethodController,
    NotificationController,
    CreditController,
    SalesDetailController,
    DocumentController,
    WhatsAppController,
    CreditPaymentController,
    DashboardController,
    DocumentTypeController,
};

// ==================== AUTENTICACIÓN ==================== //
Route::post('/check-email', [AuthenticatedSessionController::class, 'checkEmail']);
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::middleware('auth:sanctum')->post('/logout', [AuthenticatedSessionController::class, 'destroy']);

// Recuperación de contraseña
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);

// Verificación de correo
Route::middleware(['auth:sanctum'])
    ->get('/verify-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
    ->name('verification.verify');

Route::middleware(['auth:sanctum', 'throttle:6,1'])
    ->post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->name('verification.send');

// Usuario autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'roles' => $user->getRoleNames(), // 🔹 Devuelve todos los roles
        'permissions' => $user->getAllPermissions()->pluck('name'), // opcional
    ]);
});

// ==================== ADMIN PANEL ==================== //
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'restrict.cajero.delete'])
    ->group(function () {

        Route::middleware('role:administrador|cajero')->get('/dashboard/data', [DashboardController::class, 'index']);

        
        Route::middleware('role:administrador')->group(function () {
            Route::get('/users', [UserController::class, 'index']);
            Route::put('/users/update/{id}', [UserController::class, 'update']);
            Route::delete('/users/delete/{id}', [UserController::class, 'destroy']);
        });

        Route::middleware('role:administrador|cajero')->get('/users', [UserController::class, 'index']);


        Route::middleware('role:administrador|cajero')->group(function () {
            Route::get('/customer', [CustomerController::class, 'index']);
            Route::post('/customer/create', [CustomerController::class, 'store']);
            Route::put('/customer/update/{id}', [CustomerController::class, 'update']);
            Route::delete('/customer/delete/{id}', [CustomerController::class, 'destroy']);
        });

        Route::middleware('role:administrador')->group(function () {
            Route::get('/suppliers', [SupplierController::class, 'index']);
            Route::post('/suppliers/create', [SupplierController::class, 'store']);
            Route::put('/suppliers/update/{id}', [SupplierController::class, 'update']);
            Route::delete('/suppliers/delete/{id}', [SupplierController::class, 'destroy']);
        });

        Route::middleware('role:administrador')->group(function () {
            Route::get('/shopping', [ShoppingController::class, 'index']);
            Route::post('/shopping/create', [ShoppingController::class, 'store']);
            Route::put('/shopping/update/{id}', [ShoppingController::class, 'update']);

            Route::get('/shopping-detail', [ShoppingDetailController::class, 'index']);
            Route::post('/shopping-detail/create', [ShoppingDetailController::class, 'store']);
            Route::put('/shopping-detail/update/{id}', [ShoppingDetailController::class, 'update']);
            Route::delete('/shopping-detail/delete/{id}', [ShoppingDetailController::class, 'destroy']);
        });

        Route::middleware('role:administrador')->group(function () {
            Route::get('/products', [ProductController::class, 'index']);
            Route::get('/categories', [CategoryController::class, 'index']);
            Route::post('/categories/create', [CategoryController::class, 'store']);
            Route::put('/categories/update/{id}', [CategoryController::class, 'update']);
            Route::delete('/categories/delete/{id}', [CategoryController::class, 'destroy']);
        });
        Route::middleware('role:administrador|cajero')->get('/products', [ProductController::class, 'index']);


        Route::middleware('role:administrador')->group(function () {
            Route::get('/units', [UnitController::class, 'index']);
            Route::post('/units/create', [UnitController::class, 'store']);
            Route::put('/units/update/{id}', [UnitController::class, 'update']);
            Route::delete('/units/delete/{id}', [UnitController::class, 'destroy']);
        });

        Route::middleware('role:administrador|cajero')->group(function () {
            Route::get('/sales', [SalesController::class, 'index']);
            Route::get('/sales/products', [SalesController::class, 'products']);
            Route::post('/sales/create', [SalesController::class, 'store']);
            Route::put('/sales/update/{id}', [SalesController::class, 'update']);
            Route::delete('/sales/delete/{id}', [SalesController::class, 'destroy']);
        });

        Route::middleware('role:administrador|cajero')->get('/notifications', [NotificationController::class, 'notification']);

        Route::middleware('role:administrador|cajero')->group(function () {
            Route::get('/credits', [CreditController::class, 'index']);
            Route::put('/credits/{id}', [CreditController::class, 'update']);
            Route::put('/credits', [CreditController::class, 'updateMultiple']);
        });

        Route::middleware('role:administrador|cajero')->get('/salesDetail', [SalesDetailController::class, 'index']);

        Route::middleware('role:administrador')->group(function () {
            Route::get('/document', [DocumentController::class, 'index']);

            Route::get('/document-types', [DocumentTypeController::class, 'index']);
            Route::post('/document-types/create', [DocumentTypeController::class, 'store']);
            Route::put('/document-types/update/{id}', [DocumentTypeController::class, 'update']);
            Route::delete('/document-types/delete/{id}', [DocumentTypeController::class, 'destroy']);
        });

        Route::middleware('role:administrador|cajero')->post('/whatsapp/send', [WhatsAppController::class, 'sendMessage']);

        Route::middleware('role:administrador')->apiResource('payment-methods', PaymentMethodController::class);

        Route::middleware('role:administrador|cajero')->get('/creditsPayment', [CreditPaymentController::class, 'index']);
    });
