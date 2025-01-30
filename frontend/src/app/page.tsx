import {FileUpload} from "@/components/FileUpload";

const Home = async () => (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-[420px]">
            <FileUpload/>
        </div>
    </main>
);

export default Home;
