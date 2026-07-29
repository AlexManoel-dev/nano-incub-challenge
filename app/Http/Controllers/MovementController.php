<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMovementRequest;
use App\Models\Employee;
use App\Models\Movement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class MovementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('movements/index', [
            'movements' => Movement::query()
                ->with('employee:id,name')
                ->latest()
                ->get(),

            'employees' => Employee::query()
                ->select(['id', 'name', 'balance'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StoreMovementRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated): void {
            $employee = Employee::query()
                ->lockForUpdate()
                ->findOrFail($validated['employee_id']);

            $currentBalanceInCents = $this->moneyToCents($employee->balance);
            $amountInCents = $this->moneyToCents($validated['amount']);

            if ($validated['type'] === 'exit') {
                if ($amountInCents > $currentBalanceInCents) {
                    throw ValidationException::withMessages([
                        'amount' => 'O funcionário não possui saldo suficiente.',
                    ]);
                }

                $newBalanceInCents = $currentBalanceInCents - $amountInCents;
            } else {
                $newBalanceInCents = $currentBalanceInCents + $amountInCents;
            }

            Movement::create([
                'employee_id' => $employee->id,
                'type' => $validated['type'],
                'amount' => $this->centsToMoney($amountInCents),
                'observation' => $validated['observation'],
            ]);

            $employee->update([
                'balance' => $this->centsToMoney($newBalanceInCents),
            ]);
        });

        return redirect()
            ->route('movements.index')
            ->with('success', 'Movimentação registrada com sucesso.');
    }

    private function moneyToCents(string|float|int $amount): int
    {
        return (int) round((float) $amount * 100);
    }

    private function centsToMoney(int $amountInCents): string
    {
        return number_format($amountInCents / 100, 2, '.', '');
    }
}