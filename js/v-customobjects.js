const fakeBodyCount = 0
const fakeBodySteps = 1000

const trackedKeys = ["size", "color", "fireStrength", "rotation", "position", "paritype", "displayName", "label", "labelWidth"]

// Decorate the head of our guestsgit pull
Vue.component("obj-head", {
	template: `<a-entity>

		<a-sphere 
			shadow
			:radius="headSize"
			:color="obj.color.toHex()" 
				
			>
			<obj-axes scale=".1 .1 .1" v-if="false" />
		</a-sphere>

		<a-cone v-for="(spike,index) in spikes"
			:key="index"
			:height="spike.size"
			:radius-bottom="headSize*.2"
			:position="spike.position.toAFrame(0, .2, 0)"
			:rotation="spike.rotation.toAFrame()"
			:color="spike.color.toHex(.5*Math.sin(index))" 
				
			>
		
		</a-cone>

		<!-- NOSE -->
		<a-cone
		
			:height="headSize*.5+nose.size"
			:radius-bottom="headSize*.3+nose.size"
			position="0 0 -.18"
			
			:color="nose.color.toHex(.3)" 
			
		>
	
		</a-cone>
		<!-- HAT -->
		<a-cylinder
			:height="hat.size*0.7"
			:radius="hat.size*0.2"
			position="0 0.3 0"
			:color="hat.color.toHex()" 
		>
		</a-cylinder>
		<a-cylinder
			:height="0.015"
			:radius="hat.size*0.4"
			position="0 0.2 0"
			:color="hat.color.toHex()" 
		>
		</a-cylinder>
		<!-- BODY -->
		<a-cylinder
			shadow
			:height="body.size*0.7 +0.08"
			:radius="body.size*0.1 +0.05"
			position="0 -0.65 0"
			:color="body.color.toHex()" 
		>
		</a-cylinder>
		<!-- EYES -->
		<a-sphere
			:radius="eye.size*0.15"
			position="-0.1 .1 -.18"
			:color="eye.color.toHex(0.3)" 
		>
		</a-sphere>
		<a-sphere
			:radius="eye.size*0.15"
			position="0.1 .1 -.18"
			:color="eye.color.toHex(0.3)" 
		>
		</a-sphere>
	</a-entity>
	`,
	computed: {
		color() {
			return this.obj.color.toHex?this.obj.color.toHex():this.obj.color
		},
		headSize() {
			return this.obj.size instanceof Vector ? this.obj.size.x : this.obj.size 
		},
	},
	// mounted() {
	// 	// Create a fire object
	// 	// Attach this liveobject to the ROOM
	// 	// and then the room deals with drawing it to AFRAME
	// 	let fire = new LiveObject(this.room, {
	// 		paritype: "fire",  // Tells it which type to use
	// 		uid: "fire0",
	// 		isTracked: true,
			// onUpdate({t, dt, frameCount}) {
			// 	// Change the fire's color
			// 	let hue = (noise(t*.02)+1)*180
			// 	Vue.set(this.color.v, 0, hue)
			// }
	// 	})
	data() {
		let spikeCount = Math.random()*10 + 10
		let spikes = []
		let h2 = Math.random() - .5
		let hat = new LiveObject(undefined, { 	
			size: Math.random()*.5 + .3,
			onUpdate({t, dt, frameCount}) {
				// Change the fire's color
				let rc = Math.floor(Math.random()*16777215).toString(16)
				Vue.set(hat.color,rc)
			},
		})
		let nose = new LiveObject(undefined, { 

			size: Math.random()*.1,
			// color: new Vector(noise(i)*30 + 140, 0, 40 + 20*noise(i*3))
			onUpdate({t, dt, frameCount}) {
				// Change the fire's color
				let rc = Math.floor(Math.random()*16777215).toString(16)
				Vue.set(nose.color,rc)
			},
		})
		let eye = new LiveObject(undefined, { 

			size: .2,
			// color: new Vector(noise(i)*30 + 140, 0, 40 + 20*noise(i*3))
			onUpdate({t, dt, frameCount}) {
				// Change the fire's color
				let rc = Math.floor(Math.random()*16777215).toString(16)
				Vue.set(eye.color,rc)
			},
		})
		for (var i = 0; i < spikeCount; i++) {
			let h = .1
			let spike = new LiveObject(undefined, { 

				size: Math.random()*.4 + .2,
				// color: new Vector(noise(i)*30 + 140, 0, 40 + 20*noise(i*3))
				onUpdate({t, dt, frameCount}) {
					// Change the fire's color
					let rc = Math.floor(Math.random()*16777215).toString(16)
					Vue.set(spike.color,rc)
				},
			})
			let r = .2
			// Put them on the other side
			let theta = 4*noise(i*10) + 3
			spike.position.setToCylindrical(r, theta, h*.3)
			// Look randomly
			spike.lookAt(0, h2, 0)
			spike.rotateX(-Math.PI/2)
			spikes.push(spike)
		}
		let body = new LiveObject(undefined, { 	
			size: Math.random()*.8 + .4,
			onUpdate({t, dt, frameCount}) {
				// Change the fire's color
				let rc = Math.floor(Math.random()*16777215).toString(16)
				Vue.set(hat.color,rc)
			},
		})
		return {
			spikes: spikes,
			hat: hat,
			nose: nose,
			body: body,
			eye: eye
		}
	},
	mounted() {
		// console.log(this.headSize)
	},
	grounded(){
	},
	props: ["obj"]
})


Vue.component("obj-fire", {
	template: `
	<a-entity>
		<a-cone
			position="0 .2 0"
			@click="click"
			:animation="heightAnimation"
			src="#fireTexture"
			height=.2
			radius-bottom=".2"
      color="red"
			:scale="(obj.fireStrength*.2 + 1) + ' ' + .1*obj.fireStrength + ' ' + (obj.fireStrength*.2 + 1)"
			>

		</a-cone>

		<a-light
			:animation="intensityAnimation"

			position="0 1 0"
			intensity="2"
			:color="obj.color.toHex()"
			type="point"
			:distance="obj.fireStrength*4 + 10"
			decay="2">
		</a-light>
	</a-entity>


	`,

	// Values computed on the fly
	computed: {
		fireMaterial() {
			return `emissive:${this.obj.color.toHex(.2)}`
		},
		
		animationSpeed() {
			return 500
		},
		intensityAnimation() {
			return `property: intensity; from:.3; to:.6; dir:alternate;dur: ${this.animationSpeed}; easing:easeInOutQuad;loop:true`
		},
		heightAnimation() {
			return `property: height; from:${this.obj.fireStrength};to:${this.obj.fireStrength*2}; dir:alternate;dur: 500; easing:easeInOutQuad;loop:true`
		}
	},

	methods: {
		click() {
			this.obj.fireStrength += 1
			this.obj.fireStrength = this.obj.fireStrength%10 + 1
      console.log("click")
			// Tell the server about this action
			this.obj.post()
		}
	},

	// this function runs once when this object is created
	mounted() {

	},

	props: ["obj"]


})

Vue.component("obj-constellation", {
	template: `
	<a-entity>
		<a-cone
			position="0 .2 0"
			src="#fireTexture"
			height=.2
			radius-bottom=".2"
      color="red"
			>

		</a-cone>
	</a-entity>


	`,

	// Values computed on the fly
	computed: {
		fireMaterial() {
			return `emissive:${this.obj.color.toHex(.2)}`
		},
		
		animationSpeed() {
			return 500
		},
		intensityAnimation() {
			return `property: intensity; from:.3; to:.6; dir:alternate;dur: ${this.animationSpeed}; easing:easeInOutQuad;loop:true`
		},
		heightAnimation() {
			return `property: height; from:${this.obj.fireStrength};to:${this.obj.fireStrength*2}; dir:alternate;dur: 500; easing:easeInOutQuad;loop:true`
		}
	},

	methods: {
		click() {
			this.obj.fireStrength += 1
			this.obj.fireStrength = this.obj.fireStrength%10 + 1
      console.log("click")
			// Tell the server about this action
			this.obj.post()
		}
	},

	// this function runs once when this object is created
	mounted() {

	},

	props: ["obj"]


})



Vue.component("obj-world", {

	template: `
	<a-entity>
  </a-entity>`,


	// data() {
	// 	// Where we setup the data that this *rendered scene needs*

	// 	// EXAMPLE: Generated landscape
	// 	// Make some random trees and rocks
	// 	// Create a lot of LiveObjects (just as a way 
	// 	//  to store size and color conveniently)
	// 	// Interpret them as whatever A-Frame geometry you want!
	// 	// Cones, spheres, entities with multiple ...things?
	// 	// If you only use "noise" and not "random", 
	// 	// everyone will have the same view. (Wordle-style!)
	// 	let trees = []
	// 	let count = 30
	// 	for (var i = 0; i < count; i++) {
	// 		let h = 6 + 4*noise(i) // Size from 1 to 3
	// 		let tree = new LiveObject(undefined, { 
	// 			size: new THREE.Vector3(.3, h, .3),
	// 			color: new Vector(noise(i*50)*30 + 160, 100, 40 + 10*noise(i*10))
	// 		})
	// 		let r = 20 + 10*noise(i*40)
	// 		let theta = 2*noise(i*10)
	// 		tree.position.setToCylindrical(r, theta, h/2)
	// 		tree.lookAt(0,1,0)
	// 		trees.push(tree)
	// 	}

	// 	let rocks = []
	// 	let rockCount = 20
	// 	for (var i = 0; i < rockCount; i++) {
	// 		let h = 1.2 + noise(i*100) // Size from 1 to 3
	// 		let rock = new LiveObject(undefined, { 
	// 			size: new THREE.Vector3(h, h, h),
	// 			color: new Vector(noise(i)*30 + 140, 0, 40 + 20*noise(i*3))
	// 		})
	// 		let r = 4 + 1*noise(i*1)
	// 		// Put them on the other side
	// 		let theta = 2*noise(i*10) + 3
	// 		rock.position.setToCylindrical(r, theta, h*.3)
	// 		// Look randomly
	// 		rock.lookAt(Math.random()*100,Math.random()*100,Math.random()*100)
	// 		rocks.push(rock)
	// 	}


	// 	return {
	// 		trees: trees,
	// 		rocks: rocks
	// 	}
	// },

	mounted() {
		// Create a fire object
		// Attach this liveobject to the ROOM
		// and then the room deals with drawing it to AFRAME
		let fire = new LiveObject(this.room, {
			paritype: "fire",  // Tells it which type to use
			uid: "fire0",
			isTracked: true,
			onUpdate({t, dt, frameCount}) {
				// Change the fire's color
				let hue = (noise(t*.02)+1)*180
				Vue.set(this.color.v, 0, hue)
			}
		})
	

		fire.position.set(0, 0, 0)
		fire.fireStrength = 1

    let c1 = new LiveObject(this.room, {
      paritype: "constellation",
      uid: "c0",
      isTracked: true,
      onUpdate() {}
    })
    c1.position.set(0, 0, -5)
    c1.fireStrength=2
	
	},

	props: ["room"]

})

