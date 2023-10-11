import * as Yup from 'yup'

export const FilterSTatistics = Yup.object().shape({
    startDate: Yup.string().required("تاریخ شروع الزامی است"),
    endDate: Yup.string().required("تاریخ پایان الزامی است"),
})