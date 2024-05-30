import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RiderApplicationEditForm from "main/components/RiderApplication/RiderApplicationEditForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";

import { toast } from "react-toastify";

export default function RiderApplicationEditPage() {
  let { id, status, notes} = useParams();

  const { data: riderApplication, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/rider/admin?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/rider/admin`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (riderApplication) => ({
    url: "/api/rider/admin",
    method: "PUT",
    params: {
      id: riderApplication.id,
      notes: riderApplication.notes,
      status: riderApplication.status,
    },
    data: {
        perm_number: riderApplication.perm_number,
        description: riderApplication.description,
    }
  });

  const onSuccess = (riderApplication) => {
    toast(`Application Updated - id: ${riderApplication.id}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/rider/admin?id=${id}&status=${status}&notes=${notes}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess) {
    return <Navigate to="/admin/applications/riders" />
  }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Rider Application</h1>
                {riderApplication &&
                <RiderApplicationEditForm initialContents={riderApplication} submitAction={onSubmit} />
                }
            </div>
        </BasicLayout>
    )
}