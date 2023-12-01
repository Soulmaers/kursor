
import { SelectObjectsView } from '../reportsModules/class/SelectObjectsView.js'

export let classReports;
export function reportsContainer() {
    if (!classReports) {
        classReports = new SelectObjectsView()
    }

}