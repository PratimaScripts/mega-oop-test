import cookie from "react-cookies";

const ENV_TYPE = process.env.NODE_ENV;
const appDomain = process.env.REACT_APP_DOMAIN_ROOT || "rentoncloud.com";


export const saveTokenInCookie = (token, domain, path) => {
    if(!token) {
        throw TypeError('Token must be provide')
    }

    saveDataInCookie(process.env.REACT_APP_AUTH_TOKEN, token, domain, path)
}

export const saveDataInCookie = (name, data, domain=appDomain, path="/") => {
    if(!name) {
        throw TypeError("name must be provided")
    }
    
    cookie.save(name, data, {
        path: path,
        domain: ENV_TYPE === "development" ? "localhost" : domain,
        secure: ENV_TYPE === "development" ? false : true
    });

}

export const removeTokenFromCookie = (path="/", domain=appDomain) => {
    removeDataFromCookie(process.env.REACT_APP_AUTH_TOKEN, path, domain)
}

export const removeDataFromCookie = (name, path="/", domain=appDomain) => {
    if(!name) {
        throw TypeError("name must be provided")
    }
        
    cookie.remove(name, { path, 
        domain : ENV_TYPE === "development" ? "localhost" : domain, 
        secure: ENV_TYPE === "development" ? false : true });
}