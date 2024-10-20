<template>
    <transition name="fade">
        <div v-if="visible" class="notification" :class="notificationClass">
            <span class="icon">{{ emoji }}</span>
            <div class="content">
                <h4 class="title">{{ title }}</h4>
                <p class="message">{{ message }}</p>
            </div>
            <button class="close-button" @click="closeNotification">✖</button>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'AppNotification',
    props: {
        message: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        duration: {
            type: Number,
            default: 3000
        }
    },
    data() {
        return {
            visible: false,
            title: '',
            emoji: '',
        };
    },
    computed: {
        notificationClass() {
            return {
                success: this.id === 3,
                error: this.id === 2,
                warning: this.id === 1,
            };
        }
    },
    methods: {
        show() {
            this.setNotificationProperties();
            this.visible = true;
            setTimeout(() => {
                this.closeNotification();
            }, this.duration);
        },
        setNotificationProperties() {
            switch (this.id) {
                case 1:
                    this.title = 'Advertencia';
                    this.emoji = '⚠️'; // Emoji para advertencia
                    break;
                case 2:
                    this.title = 'Error';
                    this.emoji = '❌'; // Emoji para error
                    break;
                case 3:
                    this.title = 'Éxito';
                    this.emoji = '✅'; // Emoji para éxito
                    break;
                default:
                    this.title = 'Notificación';
                    this.emoji = '';
            }
        },
        closeNotification() {
            this.visible = false;
        }
    }
};
</script>

<style scoped>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 9999;
    transition: opacity 0.3s ease;
}

.notification.success {
    background-color: #d4edda;
    color: #155724;
    border-left: 5px solid #28a745;
}

.notification.error {
    background-color: #f8d7da;
    color: #721c24;
    border-left: 5px solid #dc3545;
}

.notification.warning {
    background-color: #fff3cd;
    color: #856404;
    border-left: 5px solid #ffc107;
}

.icon {
    font-size: 20px;
    margin-right: 10px;
}

.content {
    flex: 1;
}

.title {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
}

.message {
    margin: 0;
    font-size: 14px;
}

.close-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: inherit;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
