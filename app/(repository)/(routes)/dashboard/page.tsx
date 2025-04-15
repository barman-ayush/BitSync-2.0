import Profile from "@/components/profile-page.component";
import { profileData, pinnedRepos } from '@/json/profile';
import { Fragment } from "react";
const Dashboardlanding = () => {
  return (
    <Fragment>
      <Profile
        profile={profileData}
        pinnedRepos={pinnedRepos}
      />
    </Fragment>
  );
};
export default Dashboardlanding;
