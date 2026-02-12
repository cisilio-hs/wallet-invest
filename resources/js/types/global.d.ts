import { PageProps as InertiaPageProps } from '@inertiajs/react';
import { AppPageProps } from './index';
import { RouteList } from 'ziggy-js';

declare global {
    namespace Inertia {
        interface PageProps extends AppPageProps {}
    }
    
    // Route function with flexible parameter typing
    function route<T extends keyof RouteList>(
        name: T,
        params?: string | number | Record<string, string | number>,
        absolute?: boolean
    ): string;
    
    // Route instance with current() method
    interface Router {
        current<T extends keyof RouteList>(name?: T, params?: Record<string, string | number>): boolean;
    }
    
    // Extend route() to return Router instance when called without params
    function route(): Router;
}

export {};
