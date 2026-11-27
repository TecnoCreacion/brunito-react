import { useProfile } from "../hooks/useProfile";
import { ProfileInfoForm } from "../components/ProfileInfoForm";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { EmailHistoryList } from "../components/EmailHistoryList";
import { SectionLoader } from "@/shared/components/SectionLoader/SectionLoader";

export const ProfilePage = () => {
    const { profile, isLoading, updateProfile, isUpdatingProfile, updatePassword, isUpdatingPassword } = useProfile();

    if (isLoading) {
        return <SectionLoader message="Cargando datos del usuario..." />;
    }

    return (
        <div className="container-xl py-4">
            <div className="row g-4">
                <div className="col-12 col-lg-7">
                    <ProfileInfoForm initialData={profile} onSubmit={updateProfile} isSubmitting={isUpdatingProfile} />
                    <EmailHistoryList histories={profile?.emailHistories ?? []} />
                </div>

                <div className="col-12 col-lg-5">
                    <ChangePasswordForm onSubmit={updatePassword} isSubmitting={isUpdatingPassword} />
                </div>
            </div>
        </div>
    );
};
