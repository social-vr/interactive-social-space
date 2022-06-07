let worldCamera = undefined

AFRAME.registerComponent('rotation-reader', {
	// Track the camera's position 
	// and copy it into the user's head

  /**
   * We use IIFE (immediately-invoked function expression) to only allocate one
   * vector or euler and not re-create on every tick to save memory.
   */
	init: function () {
		console.log('Begin tracking the camera');
		worldCamera = this.el
		console.log("CAMERA:", worldCamera)
		let r = Math.random()*1 + 1
		let theta = 100*Math.random()*1 + 1
		worldCamera.object3D.position.set(r*Math.cos(theta), 1.5, r*Math.sin(theta))
		worldCamera.object3D.lookAt(0,.5,0)
		console.log("****Start pos", worldCamera.object3D.position.toArray())
	},
	tick: (function () {
		
		return function () {
			if (room.userHead) {
				room.userHead.position.copy(this.el.object3D.position)
				room.userHead.rotation.copy(this.el.object3D.rotation)
				room.userHead.post()
			}

		};
	})()
});

Vue.component("room-scene", {
	template: `<a-scene>

		
		<!--------- ASSETS ---------->
		<a-assets>
			<img id="sky" src="img/textures/sky-night.png">
		</a-assets>

		<!--------- CAMERA --------->

		<a-camera id="camera" rotation-reader>
			<a-cursor></a-cursor>

			<!-------- Output text ----->
			<a-entity>
				<a-text 
					v-if="room.userHead"
					width=".8"
					color="black"
					:value="room.userHead.position.toFixed(2)" 
					position="-.7 .7 -1">
				</a-text>
				
				<a-text 
					width="2"
					color="black"
					:value="room.titleText" 
					position="-.7 .6 -1">
				</a-text>
				<a-text 
					width="1"
					color="black"
					:value="room.detailText" 
					position="-.7 .5 -1">
				</a-text>
			</a-entity>
			
		</a-camera>
		
		<obj-world :room="room"/>


		
				
		<a-entity position="0 0 0">
			<a-entity text="value:hello;font:/fonts/helvetica-sdf.fnt; fontImage:/fonts/helvetica-sdf.png;width:10;color:black" position="0 1 0"></a-entity>
			
			<!--------- ALL THE OBJECTS YOU'VE MADE --------->
			<live-object  v-for="obj in room.objects" :key="obj.uid" :obj="obj" />
		</a-entity>


	</a-scene>`,

	methods: {
		camtick() {
			console.log("cam")
		}
	},
	mounted() {
		// Create 
	},

	data() {
		return  {
			
		}
	},

	props: ["room"],
})

Vue.component("sam-scene", {
  template: `
  <a-scene light="defaultLightsEnabled: false">
    <a-assets> <!-- load these first, we wil use later -->
      <img id="nightSkyTexture" src="https://cdn.glitch.global/bae45d64-8466-472c-b3f1-9c506967687e/angryimg.png?v=1651091966097" crossorigin="anonymous"/>
      <img id="oceanTexture" src="https://cdn.glitch.global/bae45d64-8466-472c-b3f1-9c506967687e/WaterPlain0008_1_download600.jpg?v=1651094425849" crossorigin="anonymous"/>
      <!---  https://www.textures.com/download/WaterPlain0008/9434  --->
      <img id="fireTexture" src="https://cdn.glitch.global/bae45d64-8466-472c-b3f1-9c506967687e/NQQS5AUHUVE4XOG7NSQYLA2XWI.webp?v=1651102936184" crossorigin="anonymous"/>
      <!----- https://www.google.com/search?q=fire&rlz=1C1GEWG_enUS989US989&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjziIDWtbX3AhVZAp0JHSjyDdcQ_AUoAnoECAEQBA&biw=1152&bih=1068&dpr=1.67#imgrc=hEM6Fnb0YfKoUM -->
      <img id="woodTexture" src="https://cdn.glitch.global/bae45d64-8466-472c-b3f1-9c506967687e/download.jpg?v=1651103437482" crossorigin="anonymous"/>
      <!----    https://www.google.com/url?sa=i&url=https%3A%2F%2Ftddhardware.com%2Fshop%2Fcabinet-doors-and-fronts%2Fcabinet-doors%2Fcleaf-wood-grain-vertcal-flat%2Fs013-cypress-point-cabinet-door-wood-grain-flat-vertical%2F&psig=AOvVaw3-1AlqzuoeyacMIhKwT4PO&ust=1651189826841000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCPDiqMu3tfcCFQAAAAAdAAAAABAk --->
      <img id="mountains" src="https://cdn.glitch.global/bae45d64-8466-472c-b3f1-9c506967687e/photo-1542662565-7e4b66bae529.avif?v=1651104886184" crossorigin="anonymous"/>
      <!---- https://www.istockphoto.com/photo/panoramic-beautiful-view-of-mount-ama-dablam-gm513247652-87509653?utm_source=unsplash&utm_medium=affiliate&utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fmountain-range&utm_term=mountain%20range%3A%3Asearch-explore-top-affiliate-outside-feed-x-v2%3Ab-->
      <img id="sandTexture" src="https://cdn.glitch.global/bae45d64-8466-472c-b3f1-9c506967687e/SoilBeach0104_3_download600.jpg?v=1651105164691" crossorigin="anonymous"/>
      <!--https://www.textures.com/download/SoilBeach0104/48686-->
      <img id="starNightTexture" src="https://cdn.glitch.global/bae45d64-8466-472c-b3f1-9c506967687e/DelphinusStars.jpg?v=1651156814423" crossorigin="anonymous"/>
      <!---https://astronomy.com/news/observing/2020/10/the-sky-this-week-from-october-9-to-16--->
    </a-assets>
    <a-entity light="type: ambient; color: hsl(0, 10%, 20%)"></a-entity>      
    
    <a-entity id="player0" position="0 1.6 3">
      <a-camera/>
    </a-entity>
    <a-entity id="player1" position="-3 1.6 0" rotation="0 -70 0">
      <a-camera/>
    </a-entity>
    <a-entity id="surroundingNature" position ="0 0 0">
        <a-cylinder repeat="20 20" src="#sandTexture" height=".02" radius="4"/>
        <a-cylinder repeat="20 20" src="#oceanTexture" height=".01" radius="40"/>
        <a-cylinder  position="0 10 0" repeat="1 1" height="100" radius="40" src="#mountains" open-ended="true" side="double"/>
      </a-entity>
    
      <a-entity id="fire"  position = "0 0 0">
        <a-cone radius-bottom="1" radius-top="0" height="2" src="#fireTexture"/>
          <a-animation attribute="height"
           dur="1000"
           direction="alternate"               
           to="3"
           repeat="indefinite"></a-animation>
        <a-animation attribute="rotation" dur="4000" fill="forwards" to="0 360 0" repeat="indefinite"></a-animation>
      </a-entity>
      
      <a-entity light="type: point; color: hsl(15,60%,51%); intensity: .6" position="0 .4 0"/>
      
      <a-entity position="0 0 -3">
        <a-cylinder src="#woodTexture" repeat="2 1" height="1" radius=".5"/>
      </a-entity>
      <a-entity position="0 0 3">
        <a-cylinder src="#woodTexture" repeat="2 1" radius=".5"/>
      </a-entity>
      <a-entity position="3 0 0">
        <a-cylinder src="#woodTexture" repeat="2 1" radius=".5"/>
      </a-entity>
      <a-entity position="-3 0 0">
        <a-cylinder src="#woodTexture" repeat="2 1" radius=".5"/>
      </a-entity>
      
      <a-entity id="floating-wood">
        <a-box position="10 0 -20" width="2" src="#woodTexture">
        </a-box>
      </a-entity>
      
      <a-sky repeat="4 4" src="#starNightTexture"></a-sky>
    </a-scene>
  `,
  props: ["room"],
})
