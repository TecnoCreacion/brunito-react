/**
 * Convierte el modelo de Laravel al modelo estandarizado de BrunOS.
 * Laravel nunca dictará cómo se llaman nuestras variables en React.
 */
export const userAdapter = (laravelUser) => {
    if (!laravelUser) return null;

    return {
        id: laravelUser.ID_Usuario || laravelUser.id,
        name: laravelUser.Nombre_Completo || laravelUser.name,
        email: laravelUser.Correo_Electronico || laravelUser.email,
    };
};
