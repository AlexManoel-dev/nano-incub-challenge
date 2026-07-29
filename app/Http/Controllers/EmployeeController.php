<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        $employees = Employee::query()
            ->get();

        return Inertia::render('employees/index', [
            'employees' => $employees,
        ]);
    }

    public function store(
        StoreEmployeeRequest $request
    ): RedirectResponse {
        Employee::create($request->validated());

        return redirect()
            ->route('employees.index')
            ->with('success', 'Funcionário cadastrado com sucesso.');
    }

    public function update(
        UpdateEmployeeRequest $request,
        Employee $employee
    ): RedirectResponse {
        $employee->update($request->validated());

        return redirect()
            ->route('employees.index')
            ->with('success', 'Funcionário atualizado com sucesso.');
    }

    
    public function destroy(Employee $employee): RedirectResponse
    {
        if ($employee->movements()->exists()) {
            return back()->withErrors([
                'employee' => 'Não é possível excluir um funcionário que possui movimentações.',
            ]);
        }

        $employee->delete();

        return back()->with('success', 'Funcionário excluído com sucesso.');
    }
}