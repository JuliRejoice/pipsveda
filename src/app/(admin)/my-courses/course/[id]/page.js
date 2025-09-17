import { PreventProvider } from "@/context/PreventContext";
import Breadcumbs from "@/modules/(admin)/breadcumbs";
import CourseDetails from "@/modules/(admin)/myCourses/courseDetails";

export default async function page({ params }) {
  const id = await params.id;

  return(
    <PreventProvider>
      <div>
        <Breadcumbs/>
        <CourseDetails params={id} />
      </div>
    </PreventProvider>
  )
}
