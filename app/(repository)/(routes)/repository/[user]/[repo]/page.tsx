import RepositoryViewer from "@/components/repository-component";
import { Fragment } from "react";

const RepoView = async ({
  params,
}: {
  params: { user: string; repo: string };
}) => {
  const { user, repo } = await params;

  return (
    <Fragment>
      <RepositoryViewer user={user} repo={repo} />
    </Fragment>
  );
};

export default RepoView;
