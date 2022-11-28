import { createRouter, createWebHistory } from "vue-router";
import ExampleOne from "../views/ExampleOne.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: ExampleOne,
    },
    {
      path: "/example1",
      name: "example1",
      component: ExampleOne,
    },
    {
      path: "/example2",
      name: "example2",
      /**
       * Route level code-splitting
       * this generates a separate chunk (ExampleTwo.[hash].js) for this route
       * which is lazy-loaded when the route is visited.
       */
      component: () => import("../views/ExampleTwo.vue"),
    },
    {
      path: "/example3",
      name: "example3",
      component: () => import("../views/ExampleThree.vue"),
    },
  ],
});

export default router;
