import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const root = Vue.component('root', {
    template: '<router-view></router-view>'
});

export let router = new Router({
    routes: [
        {"path":"/","name":"root","redirect":"HG1","component":root,"children":[{"path":"HG1","name":"HG1","meta":{"title":"HG1"}},{"path":"HG2","name":"HG2","meta":{"title":"HG2"},"children":[{"path":"HG21","name":"HG21","meta":{"title":"HG21"}},{"path":"HG22","name":"HG22","meta":{"title":"HG22"}}]},{"path":"HG3","name":"HG3","meta":{"title":"HG3"}}]},
        {
            "path": "/*",
            "redirect": "/"
        }
    ]
});

router.beforeEach((to, from, next) => {
    // 修改body的class，方便区分不同页面的样式差异
  document.getElementsByTagName('body')[0].className=to.name.replace(/([A-Z])/g, "-$1").replace(/^-/,'').toLowerCase();
  next();
});
