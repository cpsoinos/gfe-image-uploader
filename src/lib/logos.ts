import dynamic from 'next/dynamic'

export const logos = new Map([['Webflow', dynamic(() => import('@/icons/webflow-logo.svg'))]])
