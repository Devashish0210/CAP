import Form from "../_components/form";

export default function Page({ params }: { params: { id: string } }) {
    return <div><Form id={params.id} /></div>
}