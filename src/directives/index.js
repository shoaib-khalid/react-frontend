import Vue from 'vue';
import { store } from '../_stores/index';

Vue.directive('can-view', {
  isLiteral: false,
  isEmpty: false,
  twoWay: true,
  inserted: function(el) {
    // console.log('inserted input')
  },
  // update: function(el, binding, vnode, oldVnode) {
  //   // do something based on the updated value
  //   // this will also be called for the initial value
  //   console.log('update input')
  //   const behaviour = binding.modifiers.disable ? 'disable' : 'hide'

  //   // console.log("binding",binding.value);

  //   if(binding.value)
  //   {
  //     let permissions = binding.value.filter(val=>store.getters.getPermissions.findIndex(value=>value===val)>=0);

  //     if(permissions.length>0){
  //       $(el).show();
  //       // $(el).css('display','block');
  //     }
  //     else{
  //       // $(el).css('display','none');
  //       $(el).hide();
  //     }
      
  //   }
  // },
  bind: function(el, binding, vnode) {
    const behaviour = binding.modifiers.disable ? 'disable' : 'hide'

    // console.log("binding",store.getters.getPermissions,binding.value);

    if(binding.value)
    {
      let permissions = binding.value.filter(val=>store.getters.getPermissions.findIndex(value=>value===val)>=0);

      if(permissions.length>0){
        $(el).show();
        // $(el).css('display','block');
      }
      else{
        // $(el).css('display','none');
        $(el).hide();
      }
      
    }
  }
})

// Vue.directive('can-view', function (el, bindings, vnode) {
//   const behaviour = bindings.modifiers.disable ? 'disable' : 'hide'

//   // console.log("binding",bindings.value);

//   if(bindings.value)
//   {
//   	let permissions = bindings.value.filter(val=>store.getters.getPermissions.findIndex(value=>value===val)>=0);

// 	  if(permissions.length>0){
// 	  	$(el).show();
//       // $(el).css('display','block');
//     }
// 	  else{
//       // $(el).css('display','none');
//       $(el).hide();
//     }
	 	
//   }

	  

//   // const ok = acl.can(user, binding.arg, binding.value)
//   // if (!ok) {
//   //   if (behaviour === 'hide') {
//   //     commentNode(el, vnode)
//   //   } else if (behaviour === 'disable') {
//   //     el.disabled = true
//   //   }
//   // }
// })

// Vue.directive('can-show', function (el, bindings, vnode) {
//   const behaviour = bindings.modifiers.disable ? 'disable' : 'hide'

//   // console.log("binding",bindings.value);

//   if(bindings.value)
//   {
//     let permissions = bindings.value.filter(val=>store.getters.getPermissions.findIndex(value=>value===val)>=0);

//     if(permissions.length>0)
//       $(el).css('display','block');
//     else
//       $(el).css('display','none');
//   }

    

//   // const ok = acl.can(user, binding.arg, binding.value)
//   // if (!ok) {
//   //   if (behaviour === 'hide') {
//   //     commentNode(el, vnode)
//   //   } else if (behaviour === 'disable') {
//   //     el.disabled = true
//   //   }
//   // }
// })
