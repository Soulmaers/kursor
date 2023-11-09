
import { SelectObjectsView } from '../reportsModules/class/SelectObjectsView.js'

let classReports;
export function reportsContainer() {
    if (!classReports) {
        classReports = new SelectObjectsView()
    }

}