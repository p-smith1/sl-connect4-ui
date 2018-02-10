import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
