import AlgobotDetails from "@/modules/(admin)/myCourses/algobotDetails";


export default async function page({ params }) {
  const id = await params.id;

  return(
    <div>
      <AlgobotDetails id={id}/>
    </div>
  )
}
