import { Fragment } from 'react'

const RepoView = async ({ params }: { params: { user: string; repo: string } }) => {
    const { user, repo } = (await params);
    
    return (
        <Fragment>
            dYNAMMIC rEPO
        </Fragment>
    );
};

export default RepoView;
