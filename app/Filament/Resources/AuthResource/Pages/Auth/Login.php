<?php

namespace App\Filament\Resources\AuthResource\Pages\Auth;

use Filament\Forms\Form;
use Filament\Forms\Components\Component;
use Filament\Forms\Components\TextInput;
use Filament\Pages\Auth\Login as AuthLogin;
use Illuminate\Validation\ValidationException;

class Login extends AuthLogin
{
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                $this->getLoginFormComponent(),
                $this->getPasswordFormComponent(),
                $this->getRememberFormComponent(),
            ])
            ->statePath('data');
    }

    protected function getLoginFormComponent(): Component
    {
        return TextInput::make('login')
            ->label('Username')
            ->required()
            ->autocomplete()
            ->autofocus()
            ->extraInputAttributes(['tabindex' => 1]);
    }

    protected function getCredentialsFromFormData(array $data): array
    {
        $login_type = filter_var($data['login'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        return [
            $login_type => $data['login'],
            'password'  => $data['password'],
        ];
    }
    protected function throwFailureValidationException(): never
    {
        // First, check if the user exists with the given username/email
        $credentials = $this->getCredentialsFromFormData($this->data);
        $loginField = array_key_first($credentials);

        $user = \App\Models\User::where($loginField, $credentials[$loginField])->first();

        if (!$user) {
            // User doesn't exist, show error on username/email field
            throw ValidationException::withMessages([
                'data.login' => __('filament-panels::pages/auth/login.messages.failed'),
            ]);
        } else {
            // User exists but password is wrong, show error on password field
            throw ValidationException::withMessages([
                'data.password' => 'Password yang Anda masukkan salah.',
            ]);
        }
    }
}
