import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function EmployeeCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post('/employees');
    }

    return (
        <>
            <Head title="Novo funcionário" />

            <main className="mx-auto max-w-2xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">
                        Novo funcionário
                    </h1>

                    <p className="mt-1 text-gray-600">
                        Cadastre um funcionário no sistema.
                    </p>
                </div>

                <form
                    onSubmit={submit}
                    className="space-y-6 rounded-lg border p-6"
                >
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block font-medium"
                        >
                            Nome
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            className="w-full rounded-md border px-3 py-2"
                            placeholder="Nome do funcionário"
                        />

                        {errors.name && (
                            <p className="mt-2 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link
                            href="/employees"
                            className="rounded-md border px-4 py-2"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
                        >
                            {processing
                                ? 'Salvando...'
                                : 'Salvar funcionário'}
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}