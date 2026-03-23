export interface NavPrimaryProps {
  title: string
  to: string
  icon: React.ReactNode
  activeOptions: { exact: boolean }
}[]