<template>
	<div class="wrapper">
		<v-header />
		<v-sidebar />
		<div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
			<v-tabs></v-tabs>
			<div class="content">
				<router-view v-slot="{ Component }">
					<transition name="move" mode="out-in">
						<keep-alive :include="tabs.nameList">
							<component :is="Component"></component>
						</keep-alive>
					</transition>
				</router-view>
			</div>
		</div>
	</div>
</template>
<script setup>
import { useSidebarStore } from '@/stores/sidebar';
import { useTabsStore } from '@/stores/tabs';
import vHeader from '@/components/header.vue';
import vSidebar from '@/components/sidebar.vue';
import vTabs from '@/components/tabs.vue';

const sidebar = useSidebarStore();
const tabs = useTabsStore();
</script>

<style>
.wrapper {
	height: 100vh;
	overflow: hidden;
}
.content-box {
	position: absolute;
	left: 220px;
	right: 0;
	top: 70px;
	bottom: 0;
	/* padding-bottom: 30px; */
	-webkit-transition: left 0.3s ease-in-out;
	transition: left 0.3s ease-in-out;
	background: #eef0fc;
	overflow: hidden;
}

.content {
	width: calc(100% - 28px);
	height: calc(100vh - 143px);
	padding: 16px;
	overflow-y: scroll;
	box-sizing: border-box;
	background: #fff;
	margin: 14px;
	border-radius: 6px;
}

.content::-webkit-scrollbar {
  width: 0;
}

.content-collapse {
  left: 65px;
}
</style>
