import { onMounted, onUnmounted } from "vue";

const trackMount = (name) => {

    onMounted(() => {
        console.log(`${name}  Mounted`);
    });

    onUnmounted(() => {
        console.log(`${name}  unmounted`);
    });
}
    
export default trackMount;