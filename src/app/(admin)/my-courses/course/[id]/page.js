import { PreventProvider } from "@/context/PreventContext";
import Breadcumbs from "@/modules/(admin)/breadcumbs";
import CourseDetails from "@/modules/(admin)/myCourses/courseDetails";

export default async function page({ params, searchParams }) {
  const id = await params.id;
  const purchasedDate = searchParams.purchasedDate;

  return(
    <PreventProvider>
      <div>
        <Breadcumbs/>
        <CourseDetails params={id} purchasedDate={purchasedDate} />
      </div>
    </PreventProvider>
  )
}
