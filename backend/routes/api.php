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
    DashboardController,
    UserController,
    CustomerController,
    SupplierController,
    ProductController,
    CategoryController,
    UnitController,
    PaymentMethodController,
    SalesController,
    SalesDetailController,
    ShoppingController,
    ShoppingDetailController,
    CreditController,
    CreditPaymentController,
    NotificationController,
    DocumentController,
    DocumentTypeController,
    WhatsAppController
};

// Autenticación
Route::post('/check-email', [AuthenticatedSessionController::class, 'checkEmail']);
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::middleware('auth:sanctum')->post('/logout', [AuthenticatedSessionController::class, 'destroy']);

// Recuperación de contraseña
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);

// Verificación de correo electrónico
Route::middleware(['auth:sanctum'])
    ->get('/verify-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
    ->name('verification.verify');

Route::middleware(['auth:sanctum', 'throttle:6,1'])
    ->post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->name('verification.send');

// Usuario identificado o autenticado

Route::prefix('admin')
    ->middleware(['auth:sanctum', 'restrict.cajero.delete'])
    ->group(function () {

        Route::middleware('role:administrador|cajero')->group(function () {
            // Dashboard
            Route::get('/user', [AuthenticatedSessionController::class, 'me']);
            Route::get('/dashboard/data', [DashboardController::class, 'index']);

            // Usuarios y clientes
            Route::get('/users', [UserController::class, 'index']);
            Route::get('/customer', [CustomerController::class, 'index']);
            Route::post('/customer/create', [CustomerController::class, 'store']);
            Route::put('/customer/update/{id}', [CustomerController::class, 'update']);
            Route::delete('/customer/delete/{id}', [CustomerController::class, 'destroy']);

            // Proveedores
            Route::get('/suppliers', [SupplierController::class, 'index']);

            // Productos y categorías
            Route::get('/products', [ProductController::class, 'index']);
            Route::get('/categories', [CategoryController::class, 'index']);
            Route::get('/units', [UnitController::class, 'index']);

            // Créditos
            Route::get('/credits', [CreditController::class, 'index']);
            Route::get('/creditsPayment', [CreditPaymentController::class, 'index']);

            // Ventas
            Route::get('/sales', [SalesController::class, 'index']);
            Route::get('/sales/products', [SalesController::class, 'products']);
            Route::post('/sales/create', [SalesController::class, 'store']);
            Route::put('/sales/update/{id}', [SalesController::class, 'update']);
            Route::delete('/sales/delete/{id}', [SalesController::class, 'destroy']);
            Route::get('/salesDetail', [SalesDetailController::class, 'index']);

            // Documentos
            Route::get('/document', [DocumentController::class, 'index']);
            Route::get('/document-types', [DocumentTypeController::class, 'index']);

            // Métodos de pago
            Route::apiResource('payment-methods', PaymentMethodController::class);

            // Notificaciones y WhatsApp
            Route::get('/notifications', [NotificationController::class, 'notification']);
            Route::post('/whatsapp/send', [WhatsAppController::class, 'sendMessage']);
        });

        Route::middleware('role:administrador')->group(function () {
            // Usuarios
            Route::put('/users/update/{id}', [UserController::class, 'update']);
            Route::delete('/users/delete/{id}', [UserController::class, 'destroy']);

            // Proveedores
            Route::post('/suppliers/create', [SupplierController::class, 'store']);
            Route::put('/suppliers/update/{id}', [SupplierController::class, 'update']);
            Route::delete('/suppliers/delete/{id}', [SupplierController::class, 'destroy']);

            // Compras y detalles de compras
            Route::get('/shopping', [ShoppingController::class, 'index']);
            Route::post('/shopping/create', [ShoppingController::class, 'store']);
            Route::put('/shopping/update/{id}', [ShoppingController::class, 'update']);
            Route::delete('/shopping/delete/{id}', [ShoppingController::class, 'destroy']);

            Route::get('/shopping-detail', [ShoppingDetailController::class, 'index']);
            Route::post('/shopping-detail/create', [ShoppingDetailController::class, 'store']);
            Route::put('/shopping-detail/update/{id}', [ShoppingDetailController::class, 'update']);
            Route::delete('/shopping-detail/delete/{id}', [ShoppingDetailController::class, 'destroy']);

            // Categorías
            Route::post('/categories/create', [CategoryController::class, 'store']);
            Route::put('/categories/update/{id}', [CategoryController::class, 'update']);
            Route::delete('/categories/delete/{id}', [CategoryController::class, 'destroy']);

            // Unidades
            Route::post('/units/create', [UnitController::class, 'store']);
            Route::put('/units/update/{id}', [UnitController::class, 'update']);
            Route::delete('/units/delete/{id}', [UnitController::class, 'destroy']);

            // Créditos
            Route::put('/credits/{id}', [CreditController::class, 'update']);
            Route::put('/credits', [CreditController::class, 'updateMultiple']);

            // Tipos de documentos
            Route::post('/document-types/create', [DocumentTypeController::class, 'store']);
            Route::put('/document-types/update/{id}', [DocumentTypeController::class, 'update']);
            Route::delete('/document-types/delete/{id}', [DocumentTypeController::class, 'destroy']);
        });
    });
