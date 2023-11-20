
import { SelectObjectsView } from '../reportsModules/class/SelectObjectsView.js'

export let classReports;
export function reportsContainer() {
    if (!classReports) {
        classReports = new SelectObjectsView()
    }
    const titleChange_list_name = document.querySelectorAll('.titleChange_list_name')
    titleChange_list_name.forEach(e => e.textContent = e.getAttribute('rel'))
    document.querySelector('.object').style.display = 'none'
}