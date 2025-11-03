import CategoryDetails from '@/modules/(admin)/categoryCourses';

async function Categories({ params }) {
    const {id}  = await params;
    return (
        <div>
            <CategoryDetails id={id} />
        </div>
    );
}

export default Categories;