import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    LoaderCircle,
    Pencil,
    Plus,
    Trash2,
    Users,
} from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type Employee = {
    id: number;
    name: string;
    balance: string;
    created_at: string;
};

type Props = {
    employees: Employee[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Funcionários',
        href: '/employees',
    },
];

export default function EmployeeIndex({ employees }: Props) {
    const [formOpen, setFormOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    
    useEffect(() => {
        router.reload({ only: ['employees'] });
    }, []);

    const [selectedEmployee, setSelectedEmployee] =
        useState<Employee | null>(null);

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        name: '',
    });

    const {
        delete: destroy,
        processing: deleting,
        errors: deleteErrors,
        clearErrors: clearDeleteErrors,
    } = useForm();

    const isEditing = selectedEmployee !== null;

    function openCreateModal() {
        setSelectedEmployee(null);
        clearErrors();
        reset();
        setFormOpen(true);
    }

    function openEditModal(employee: Employee) {
        setSelectedEmployee(employee);
        clearErrors();
        setData('name', employee.name);
        setFormOpen(true);
    }

    function closeFormModal() {
        setFormOpen(false);
        setSelectedEmployee(null);
        clearErrors();
        reset();
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (selectedEmployee) {
            put(`/employees/${selectedEmployee.id}`, {
                preserveScroll: true,
                onSuccess: closeFormModal,
            });

            return;
        }

        post('/employees', {
            preserveScroll: true,
            onSuccess: closeFormModal,
        });
    }

    function openDeleteModal(employee: Employee) {
        clearDeleteErrors();
        setSelectedEmployee(employee);
        setDeleteOpen(true);
    }

    function closeDeleteModal() {
        if (deleting) {
            return;
        }

        clearDeleteErrors();
        setDeleteOpen(false);
        setSelectedEmployee(null);
    }

    function confirmDelete() {
        if (!selectedEmployee) {
            return;
        }

        destroy(`/employees/${selectedEmployee.id}`, {
            preserveScroll: true,
            onSuccess: closeDeleteModal,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Funcionários" />

            <div className="p-6">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0E7C66]/10">
                            <Users className="h-5 w-5 text-[#0E7C66]" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-[#12161C]">
                                Funcionários
                            </h1>

                            <p className="text-sm text-[#5B6472]">
                                Saldo de cada funcionário no sistema de
                                bonificação.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#0E7C66] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B6553]"
                    >
                        <Plus className="h-4 w-4" />
                        Novo funcionário
                    </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#E3E7EA] bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-[#E3E7EA] bg-[#FAFBFC]">
                                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#5B6472] uppercase">
                                    ID
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#5B6472] uppercase">
                                    Nome
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#5B6472] uppercase">
                                    Saldo
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#5B6472] uppercase">
                                    Criado em
                                </th>

                                <th className="px-5 py-3 text-right text-xs font-semibold tracking-wide text-[#5B6472] uppercase">
                                    Ações
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#EEF0F2]">
                            {employees.map((employee) => {
                                const balance = Number(employee.balance);

                                return (
                                    <tr
                                        key={employee.id}
                                        className="transition-colors hover:bg-[#FAFBFC]"
                                    >
                                        <td className="px-5 py-3.5 font-mono text-[#8A93A0] tabular-nums">
                                            #
                                            {String(employee.id).padStart(
                                                3,
                                                '0',
                                            )}
                                        </td>

                                        <td className="px-5 py-3.5 font-medium text-[#12161C]">
                                            {employee.name}
                                        </td>

                                        <td className="px-5 py-3.5">
                                            <span
                                                className={
                                                    balance > 0
                                                        ? 'inline-flex items-center rounded-full bg-[#E4F5F1] px-3 py-1 font-mono text-xs font-semibold text-[#0B6553] tabular-nums'
                                                        : 'inline-flex items-center rounded-full bg-[#F1F2F4] px-3 py-1 font-mono text-xs font-semibold text-[#5B6472] tabular-nums'
                                                }
                                            >
                                                R${' '}
                                                {balance
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3.5 text-[#5B6472]">
                                            {new Date(
                                                employee.created_at,
                                            ).toLocaleDateString('pt-BR')}
                                        </td>

                                        <td className="px-5 py-3.5">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(employee)
                                                    }
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6DAE0] text-[#5B6472] transition-colors hover:bg-[#F5F7F8] hover:text-[#12161C]"
                                                    aria-label={`Editar ${employee.name}`}
                                                    title="Editar funcionário"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openDeleteModal(employee)
                                                    }
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#F0C7C4] text-[#B3261E] transition-colors hover:bg-[#FFF1F0]"
                                                    aria-label={`Excluir ${employee.name}`}
                                                    title="Excluir funcionário"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {employees.length === 0 && (
                        <div className="flex flex-col items-center gap-2 p-14 text-center">
                            <Users className="h-8 w-8 text-[#C7CCD3]" />

                            <p className="text-sm text-[#5B6472]">
                                Nenhum funcionário cadastrado ainda.
                            </p>

                            <Link
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    openCreateModal();
                                }}
                                className="text-sm font-semibold text-[#0E7C66] hover:underline"
                            >
                                Cadastrar o primeiro
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Dialog
                open={formOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeFormModal();
                        return;
                    }

                    setFormOpen(true);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing
                                ? 'Editar funcionário'
                                : 'Novo funcionário'}
                        </DialogTitle>

                        <DialogDescription>
                            {isEditing
                                ? 'Altere os dados do funcionário selecionado.'
                                : 'Cadastre um funcionário no sistema.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-1.5 block text-sm font-medium text-[#12161C]"
                            >
                                Nome
                            </label>

                            <input
                                id="name"
                                type="text"
                                autoFocus
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                                className="w-full rounded-lg border border-[#D6DAE0] px-3 py-2.5 text-sm text-[#12161C] placeholder:text-[#A2A9B2] focus:border-[#0E7C66] focus:ring-2 focus:ring-[#0E7C66]/20 focus:outline-none"
                                placeholder="Nome do funcionário"
                            />

                            {errors.name && (
                                <p className="mt-1.5 text-sm text-[#B3261E]">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <button
                                type="button"
                                onClick={closeFormModal}
                                className="rounded-lg border border-[#D6DAE0] px-4 py-2.5 text-sm font-semibold text-[#12161C] transition-colors hover:bg-[#F5F7F8]"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#0E7C66] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B6553] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}

                                {processing
                                    ? 'Salvando...'
                                    : isEditing
                                      ? 'Salvar alterações'
                                      : 'Salvar funcionário'}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deleteOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeDeleteModal();
                        return;
                    }

                    setDeleteOpen(true);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir funcionário</DialogTitle>

                        <DialogDescription>
                            Tem certeza que deseja excluir{' '}
                            <strong>{selectedEmployee?.name}</strong>? Essa ação
                            não poderá ser desfeita.
                        </DialogDescription>
                    </DialogHeader>

                    {deleteErrors.employee && (
                        <div className="rounded-lg border border-[#F0C7C4] bg-[#FFF1F0] px-4 py-3 text-sm text-[#B3261E]">
                            {deleteErrors.employee}
                        </div>
                    )}

                    <DialogFooter>
                        <button
                            type="button"
                            onClick={closeDeleteModal}
                            disabled={deleting}
                            className="rounded-lg border border-[#D6DAE0] px-4 py-2.5 text-sm font-semibold text-[#12161C] transition-colors hover:bg-[#F5F7F8] disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={deleting}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#B3261E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8F1E18] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {deleting && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}

                            {deleting
                                ? 'Excluindo...'
                                : 'Excluir funcionário'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}