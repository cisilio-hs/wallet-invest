// Base Laravel model interface
export interface Model {
    id: number;
    created_at: string;
    updated_at: string;
}

export interface User extends Model {
    name: string;
    email: string;
    email_verified_at?: string;
    person_id?: number;
    person?: Person;
}

export interface Person extends Model {
    name: string;
    phone: string;
    birthday: string;
    users?: User[];
    wallets?: Wallet[];
}

export interface Wallet extends Model {
    person_id: number;
    name: string;
    is_dirty: boolean;
    person?: Person;
    portfolios?: Portfolio[];
    customAssets?: CustomAsset[];
    walletAllocations?: WalletAllocation[];
    transactions?: Transaction[];
    positions?: Position[];
}

export interface Portfolio extends Model {
    wallet_id: number;
    name: string;
    target_weight: number;
    wallet?: Wallet;
    walletAllocations?: WalletAllocation[];
}

export interface Asset extends Model {
    ticker: string;
    name: string;
    asset_type_id: number;
    market: string;
    currency: string;
    minimum_order_quantity?: number;
    minimum_order_value?: number;
    type?: AssetType;
    walletAllocations?: WalletAllocation[];
    transactions?: Transaction[];
    positions?: Position[];
}

export interface AssetType extends Model {
    name: string;
    slug: string;
    assets?: Asset[];
}

export interface CustomAsset extends Model {
    wallet_id: number;
    asset_type_id?: number;
    name: string;
    currency: string;
    wallet?: Wallet;
    assetType?: AssetType;
    walletAllocations?: WalletAllocation[];
    transactions?: Transaction[];
    positions?: Position[];
}

export interface WalletAllocation extends Model {
    wallet_id: number;
    portfolio_id: number;
    asset_id?: number;
    custom_asset_id?: number;
    score: number;
    wallet?: Wallet;
    portfolio?: Portfolio;
    asset?: Asset;
    customAsset?: CustomAsset;
}

export interface Transaction extends Model {
    wallet_id: number;
    asset_id?: number;
    custom_asset_id?: number;
    quantity: number;
    unit_price: number;
    gross_amount: number;
    currency: string;
    traded_at: string;
    wallet?: Wallet;
    asset?: Asset;
    customAsset?: CustomAsset;
    // Computed property
    type: 'buy' | 'sell';
}

export interface Position extends Model {
    wallet_id: number;
    asset_id?: number;
    custom_asset_id?: number;
    quantity: number;
    average_price: number;
    is_dirty: boolean;
    wallet?: Wallet;
    asset?: Asset;
    customAsset?: CustomAsset;
}

// Inertia shared props
export interface AppPageProps {
    auth: {
        user: User;
    };
    wallets?: Wallet[];
    [key: string]: any;
}

// Form data types
export interface LoginFormData {
    email: string;
    password: string;
    remember: boolean;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface WalletFormData {
    name: string;
}

export interface PortfolioFormData {
    wallet_id: number;
    name: string;
    target_weight: number;
}

export interface UpdateProfileFormData {
    name: string;
    email: string;
    phone: string;
    birthday: string;
}

export interface UpdatePasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export interface DeleteUserFormData {
    password: string;
}

// Component prop types
export interface CardProps {
    title?: string | React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    headerClass?: string;
    childrenClass?: string;
    footerClass?: string;
}

export interface DataTableColumn<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
    grow?: boolean;
    className?: string;
}

export interface FormInputBaseProps {
    label?: string;
    error?: string;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: 'normal' | 'top' | 'inside';
    className?: string;
    children: React.ReactNode;
}

export interface SelectOption {
    value: string;
    label: string;
}
