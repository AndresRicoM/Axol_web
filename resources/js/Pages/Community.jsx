import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Rive from "rive-react";

export default function Community({ auth, user }) {
    return (
        <>
            <AuthenticatedLayout user={auth.user}>
                <>
                    <div className="flex flex-col items-center justify-center min-h-screen">
                        <Rive
                            src="/assets/TITO_ALLBODY.riv" // Asegúrate de que tu ruta sea la correcta
                            style={{ width: 500, height: 500 }}
                            autoPlay={true}
                        />
                    </div>
                </>
            </AuthenticatedLayout>
        </>
    );
}
