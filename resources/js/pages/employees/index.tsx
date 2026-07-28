import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Plus, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Funcionários', href: '/employees' }];

export default function EmployeeIndex({ employees }: Props) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
    });

    function openModal() {
        clearErrors();
        setData('name', '');
        setOpen(true);
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post('/employees', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
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
                            <h1 className="text-xl font-bold tracking-tight text-[#12161C]">Funcionários</h1>
                            <p className="text-sm text-[#5B6472]">Saldo de cada funcionário no sistema de bonificação.</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={openModal}
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
                                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#5B6472] uppercase">ID</th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#5B6472] uppercase">Nome</th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#5B6472] uppercase">Saldo</th>
                                <th className="px-5 py-3 text-xs font-semibold tracking-wide text-[#5B6472] uppercase">Criado em</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#EEF0F2]">
                            {employees.map((employee) => {
                                const balance = Number(employee.balance);

                                return (
                                    <tr key={employee.id} className="transition-colors hover:bg-[#FAFBFC]">
                                        <td className="px-5 py-3.5 font-mono text-[#8A93A0] tabular-nums">
                                            #{String(employee.id).padStart(3, '0')}
                                        </td>

                                        <td className="px-5 py-3.5 font-medium text-[#12161C]">{employee.name}</td>

                                        <td className="px-5 py-3.5">
                                            <span
                                                className={
                                                    balance > 0
                                                        ? 'inline-flex items-center rounded-full bg-[#E4F5F1] px-3 py-1 font-mono text-xs font-semibold text-[#0B6553] tabular-nums'
                                                        : 'inline-flex items-center rounded-full bg-[#F1F2F4] px-3 py-1 font-mono text-xs font-semibold text-[#5B6472] tabular-nums'
                                                }
                                            >
                                                R$ {balance.toFixed(2).replace('.', ',')}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3.5 text-[#5B6472]">
                                            {new Date(employee.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {employees.length === 0 && (
                        <div className="flex flex-col items-center gap-2 p-14 text-center">
                            <Users className="h-8 w-8 text-[#C7CCD3]" />
                            <p className="text-sm text-[#5B6472]">Nenhum funcionário cadastrado ainda.</p>
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    openModal();
                                }}
                                className="text-sm font-semibold text-[#0E7C66] hover:underline"
                            >
                                Cadastrar o primeiro
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo funcionário</DialogTitle>
                        <DialogDescription>Cadastre um funcionário no sistema.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[#12161C]">
                                Nome
                            </label>

                            <input
                                id="name"
                                type="text"
                                autoFocus
                                value={data.name}
                                onChange={(event) => setData('name', event.target.value)}
                                className="w-full rounded-lg border border-[#D6DAE0] px-3 py-2.5 text-sm text-[#12161C] placeholder:text-[#A2A9B2] focus:border-[#0E7C66] focus:ring-2 focus:ring-[#0E7C66]/20 focus:outline-none"
                                placeholder="Nome do funcionário"
                            />

                            {errors.name && <p className="mt-1.5 text-sm text-[#B3261E]">{errors.name}</p>}
                        </div>

                        <DialogFooter>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-lg border border-[#D6DAE0] px-4 py-2.5 text-sm font-semibold text-[#12161C] transition-colors hover:bg-[#F5F7F8]"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#0E7C66] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B6553] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {processing ? 'Salvando...' : 'Salvar funcionário'}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}