import { ReactNode } from 'react'

declare module './TmaSdkClient' {
	export interface TmaSdkClientProps {
		children: ReactNode
	}

	export function TmaSdkClient(props: TmaSdkClientProps): React.ReactElement
}
