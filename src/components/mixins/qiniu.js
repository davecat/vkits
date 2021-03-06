/**
 * Created by ethan-liu on 2017/6/28.
 */
export const qiniu = {
    data() {
        return {
            qiniu: process.env.QINIU,
            uploadUrl: process.env.UPLOAD,
            postData: {
                token: ''
            },
        }
    },
    methods: {
        getUploadToken() {
            return this.axios.get('/api/upload/getToken').then((res) => {
                this.postData.token = res.data;
            }).catch((error) => {
                this.$message.error(error.response.data.message);;
            })
        },
        beforeUpload(file) {
            return this.getUploadToken();
        },
        photo(token) {
            if (token !== undefined && token !== '' && token !== null) {
                return this.qiniu + token + '?imageMogr2/auto-orient|imageView2/1/w/600/h/600';
            }
        },
    }
}