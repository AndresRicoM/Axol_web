import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Community({auth, user,}) {
    return (
        <>
             <AuthenticatedLayout user={auth.user}>
                <>
                    <h1>
                        Nefertari
                    </h1>
                </>
             </AuthenticatedLayout>

        </>
    );
}