export interface Theme {
    id: string;
    choirId: string;

    name: string;
    isDark: boolean;

    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    cardColor: string;
    buttonColor: string;
    navColor: string;

    buttonTextColor: string;
    secondaryTextColor: string;
    borderColor: string;

    createdAt?: string;
    updatedAt?: string;
}

export interface CreateThemePayload {
    name: string;
    isDark: boolean;
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    cardColor: string;
    buttonColor: string;
    navColor: string;
    buttonTextColor: string;
    secondaryTextColor: string;
    borderColor: string;
}
