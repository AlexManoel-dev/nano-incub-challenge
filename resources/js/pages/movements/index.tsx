import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    LoaderCircle,
    Plus,
    Wallet,
    X,
} from 'lucide-react';
import { type FormEventHandler, useEffect, useState } from 'react';

interface Employee {
    id: number;
    name: string;
    balance: string;
}

interface Movement {
    id: number;
    employee_id: number;
    type: 'entry' | 'exit';
    amount: string;
    observation: string;
    created_at: string;
    employee: {
        id: number;
        name: string;
    };
}

interface MovementForm {
    employee_id: string;
    type: 'entry' | 'exit';
    amount: string;
    observation: string;
}

interface MovementPageProps {
    movements: Movement[];
    employees: Employee[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Movimentações',
        href: '/movements',
    },
];

export default function Index({
    movements,
    employees,
}: MovementPageProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        router.reload({ only: ['movements', 'employees'] });
    }, []);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm<MovementForm>({
        employee_id: '',
        type: 'entry',
        amount: '',
        observation: '',
    });

    const selectedEmployee = employees.find(
        (employee) => employee.id === Number(data.employee_id),
    );

    const formatCurrency = (value: string | number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(Number(value));
    };

    const formatDate = (value: string): string => {
        return new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
        }).format(new Date(value));
    };

    const openModal = (): void => {
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        if (processing) {
            return;
        }

        reset();
        clearErrors();
        setIsModalOpen(false);
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(route('movements.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                setIsModalOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Movimentações" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Movimentações
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Registre entradas e saídas no saldo dos funcionários.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openModal}
                        disabled={employees.length === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                        Nova movimentação
                    </button>
                </div>

                {employees.length === 0 && (
                    <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                        Cadastre pelo menos um funcionário antes de registrar
                        movimentações.
                    </div>
                )}

                <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border px-6 py-4">
                        <h2 className="font-semibold text-foreground">
                            Histórico
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {movements.length}{' '}
                            {movements.length === 1
                                ? 'movimentação registrada'
                                : 'movimentações registradas'}
                        </p>
                    </div>

                    {movements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                <Wallet className="h-6 w-6 text-primary" />
                            </div>

                            <h3 className="font-semibold text-foreground">
                                Nenhuma movimentação registrada
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                Registre uma entrada ou saída para começar a
                                construir o histórico.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left">
                                <thead className="bg-muted/50">
                                    <tr className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                        <th className="px-6 py-3">ID</th>

                                        <th className="px-6 py-3">
                                            Funcionário
                                        </th>

                                        <th className="px-6 py-3">Tipo</th>

                                        <th className="px-6 py-3">Valor</th>

                                        <th className="px-6 py-3">
                                            Observação
                                        </th>

                                        <th className="px-6 py-3">Data</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {movements.map((movement) => {
                                        const isEntry =
                                            movement.type === 'entry';

                                        return (
                                            <tr
                                                key={movement.id}
                                                className="transition-colors hover:bg-muted/40"
                                            >
                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    #{movement.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-foreground">
                                                        {movement.employee.name}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            isEntry
                                                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                                : 'bg-red-500/10 text-red-700 dark:text-red-400'
                                                        }`}
                                                    >
                                                        {isEntry ? (
                                                            <ArrowUpCircle className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <ArrowDownCircle className="h-3.5 w-3.5" />
                                                        )}

                                                        {isEntry
                                                            ? 'Entrada'
                                                            : 'Saída'}
                                                    </span>
                                                </td>

                                                <td
                                                    className={`px-6 py-4 font-semibold ${
                                                        isEntry
                                                            ? 'text-emerald-700 dark:text-emerald-400'
                                                            : 'text-red-700 dark:text-red-400'
                                                    }`}
                                                >
                                                    {isEntry ? '+' : '-'}{' '}
                                                    {formatCurrency(
                                                        movement.amount,
                                                    )}
                                                </td>

                                                <td className="max-w-xs px-6 py-4 text-sm text-muted-foreground">
                                                    <span
                                                        className="block truncate"
                                                        title={
                                                            movement.observation
                                                        }
                                                    >
                                                        {movement.observation}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                                                    {formatDate(
                                                        movement.created_at,
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                closeModal();
                            }
                        }}
                    >
                        <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-xl">
                            <div className="flex items-center justify-between border-b border-border px-6 py-4">
                                <div>
                                    <h2 className="text-lg font-bold text-foreground">
                                        Nova movimentação
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Adicione ou retire saldo de um
                                        funcionário.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={processing}
                                    aria-label="Fechar modal"
                                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={submit} className="p-6">
                                <div className="mb-4">
                                    <label
                                        htmlFor="employee_id"
                                        className="mb-1.5 block text-sm font-medium text-foreground"
                                    >
                                        Funcionário
                                    </label>

                                    <select
                                        id="employee_id"
                                        required
                                        autoFocus
                                        value={data.employee_id}
                                        onChange={(event) =>
                                            setData(
                                                'employee_id',
                                                event.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
                                    >
                                        <option value="">
                                            Selecione um funcionário
                                        </option>

                                        {employees.map((employee) => (
                                            <option
                                                key={employee.id}
                                                value={employee.id}
                                            >
                                                {employee.name}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.employee_id && (
                                        <p className="mt-1.5 text-sm text-destructive">
                                            {errors.employee_id}
                                        </p>
                                    )}
                                </div>

                                {selectedEmployee && (
                                    <div className="mb-4 rounded-xl border border-border bg-muted/50 px-4 py-3">
                                        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                            Saldo atual
                                        </span>

                                        <p className="mt-1 text-lg font-bold text-foreground">
                                            {formatCurrency(
                                                selectedEmployee.balance,
                                            )}
                                        </p>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <span className="mb-1.5 block text-sm font-medium text-foreground">
                                        Tipo
                                    </span>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData('type', 'entry')
                                            }
                                            disabled={processing}
                                            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
                                                data.type === 'entry'
                                                    ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                    : 'border-input bg-background text-muted-foreground hover:bg-muted'
                                            }`}
                                        >
                                            <ArrowUpCircle className="h-4 w-4" />
                                            Entrada
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData('type', 'exit')
                                            }
                                            disabled={processing}
                                            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
                                                data.type === 'exit'
                                                    ? 'border-red-600 bg-red-500/10 text-red-700 dark:text-red-400'
                                                    : 'border-input bg-background text-muted-foreground hover:bg-muted'
                                            }`}
                                        >
                                            <ArrowDownCircle className="h-4 w-4" />
                                            Saída
                                        </button>
                                    </div>

                                    {errors.type && (
                                        <p className="mt-1.5 text-sm text-destructive">
                                            {errors.type}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="amount"
                                        className="mb-1.5 block text-sm font-medium text-foreground"
                                    >
                                        Valor
                                    </label>

                                    <div className="relative">
                                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                                            R$
                                        </span>

                                        <input
                                            id="amount"
                                            type="number"
                                            required
                                            min="0.01"
                                            step="0.01"
                                            inputMode="decimal"
                                            value={data.amount}
                                            onChange={(event) =>
                                                setData(
                                                    'amount',
                                                    event.target.value,
                                                )
                                            }
                                            disabled={processing}
                                            placeholder="0,00"
                                            className="w-full rounded-lg border border-input bg-background py-2.5 pr-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
                                        />
                                    </div>

                                    {errors.amount && (
                                        <p className="mt-1.5 text-sm text-destructive">
                                            {errors.amount}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label
                                        htmlFor="observation"
                                        className="mb-1.5 block text-sm font-medium text-foreground"
                                    >
                                        Observação
                                    </label>

                                    <textarea
                                        id="observation"
                                        required
                                        rows={3}
                                        maxLength={500}
                                        value={data.observation}
                                        onChange={(event) =>
                                            setData(
                                                'observation',
                                                event.target.value,
                                            )
                                        }
                                        disabled={processing}
                                        placeholder="Exemplo: bônus por desempenho mensal"
                                        className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50"
                                    />

                                    <div className="mt-1 flex justify-between gap-4">
                                        <div>
                                            {errors.observation && (
                                                <p className="text-sm text-destructive">
                                                    {errors.observation}
                                                </p>
                                            )}
                                        </div>

                                        <span className="text-xs text-muted-foreground">
                                            {data.observation.length}/500
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        disabled={processing}
                                        className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing && (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        )}

                                        Registrar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}