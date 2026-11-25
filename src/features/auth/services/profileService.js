import { profileApi } from "../api/profileApi";
import { adaptProfileFromApi } from "../adapters/profileAdapter";

export const profileService = {
    async getProfile() {
        const { data } = await profileApi.getProfile();

        return adaptProfileFromApi(data.data);
    },

    async updateProfile(formData) {
        const { data } = await profileApi.updateProfile({
            name: formData.name,
            email: formData.email,
        });

        return adaptProfileFromApi(data.data);
    },

    async updatePassword(formData) {
        const { data } = await profileApi.updatePassword({
            current_password: formData.currentPassword,
            password: formData.password,
            password_confirmation: formData.passwordConfirmation,
        });

        return data;
    },
};
