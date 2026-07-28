import { Head, Link } from '@inertiajs/react';

type Employee = {
    id: number;
    name: string;
    balance: string;
    created_at: string;
};

type Props = {
    employees: Employee[];
};

export default function EmployeeIndex({ employees }: Props) {
    return (
        <>
            <Head title="Funcionários" />

            <main className="mx-auto max-w-6xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Funcionários
                    </h1>

                    <Link
                        href="/employees/create"
                        className="rounded-md bg-black px-4 py-2 text-white"
                    >
                        Novo funcionário
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Nome</th>
                                <th className="p-3 text-left">Saldo</th>
                                <th className="p-3 text-left">Criado em</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.map((employee) => (
                                <tr
                                    key={employee.id}
                                    className="border-t"
                                >
                                    <td className="p-3">
                                        {employee.id}
                                    </td>

                                    <td className="p-3">
                                        {employee.name}
                                    </td>

                                    <td className="p-3">
                                        R$ {employee.balance}
                                    </td>

                                    <td className="p-3">
                                        {new Date(
                                            employee.created_at,
                                        ).toLocaleDateString('pt-BR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {employees.length === 0 && (
                        <p className="p-6 text-center text-gray-500">
                            Nenhum funcionário cadastrado.
                        </p>
                    )}
                </div>
            </main>
        </>
    );
}